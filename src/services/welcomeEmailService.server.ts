import type { SupabaseClient } from '@supabase/supabase-js';
import type { JSONContent } from '@tiptap/core';
import type { Database } from 'oa-shared';
import { createElement } from 'react';
import { sendEmail } from 'src/.server/resend';
import { WelcomeEmail } from 'src/.server/templates/welcome-email';
import { logger } from 'src/logger';
import { getSummaryFromTiptapJson } from 'src/utils/getSummaryFromTiptapJson';
import type Stripe from 'stripe';
import { StripeServiceServer } from './stripeService.server';
import { TenantSettingsService, type WelcomeEmailSettings } from './tenantSettingsService.server';

interface SendArgs {
  client: SupabaseClient<Database>;
  to: string;
  name: string | null;
  siteUrl: string;
  draft?: WelcomeEmailSettings;
  idempotencyKey?: string;
}

const NAME_FALLBACK = 'there';

const fillName = (text: string, name: string) => text.replaceAll('{name}', name);

const fillNameInContent = (node: JSONContent, name: string): JSONContent => ({
  ...node,
  ...(node.text !== undefined && { text: fillName(node.text, name) }),
  ...(node.content && { content: node.content.map((child) => fillNameInContent(child, name)) }),
});

const senderName = (fromName: string | null | undefined) =>
  fromName?.replace(/[<>"\r\n]/g, '').trim();

export async function sendWelcomeEmail({
  client,
  to,
  name,
  siteUrl,
  draft,
  idempotencyKey,
}: SendArgs): Promise<boolean> {
  const settingsService = new TenantSettingsService(client, siteUrl);
  const [settings, { fromName, subject, content }] = await Promise.all([
    settingsService.get(),
    draft ?? settingsService.getWelcomeEmail(),
  ]);

  if (!subject || !content) {
    return false;
  }

  const recipientName = name?.trim() || NAME_FALLBACK;
  const filledContent = fillNameInContent(content, recipientName);

  const { error } = await sendEmail({
    from: `${senderName(fromName) || settings.messageSignOff} <${settings.emailFrom}>`,
    to,
    subject: fillName(subject, recipientName),
    emailTemplate: createElement(WelcomeEmail, {
      content: filledContent,
      preview: getSummaryFromTiptapJson(filledContent) ?? '',
      settings,
    }),
    idempotencyKey,
  });

  if (error) {
    throw new Error(error);
  }

  return true;
}

export async function sendMembershipWelcomeEmail(
  event: Stripe.Event,
  stripeService: StripeServiceServer,
  client: SupabaseClient<Database>,
  tenantId: string | undefined,
  siteUrl: string,
) {
  if (!tenantId || event.type !== 'invoice.payment_succeeded') {
    return;
  }

  const invoice = event.data.object;

  if (invoice.billing_reason !== 'subscription_create') {
    return;
  }

  try {
    const customerId = invoice.customer as string;
    const customer = await StripeServiceServer.getStripeCustomer(customerId);

    if (!customer?.email) {
      logger.warn('Welcome email skipped, Stripe customer has no email:', customerId);
      return;
    }

    const profile = await stripeService.getProfileIdentityByStripeCustomerId(
      customerId,
      tenantId,
      customer.email,
    );

    await sendWelcomeEmail({
      client,
      to: customer.email,
      name: profile?.displayName || customer.name,
      siteUrl,
      idempotencyKey: `welcome-email/${invoice.id}`,
    });
  } catch (error) {
    logger.error('Welcome email failed:', error);
  }
}
