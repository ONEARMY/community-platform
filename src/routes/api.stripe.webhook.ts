import type { SupabaseClient } from '@supabase/supabase-js';
import type { ActionFunctionArgs } from 'react-router';
import { logger } from 'src/logger';
import { createSupabaseAdminServerClient } from 'src/repository/supabaseAdmin.server';
import { membershipNotifications, supporterName } from 'src/services/membership.server';
import { getSecret } from 'src/services/secretsService.server';
import {
  cancellationJustScheduled,
  cancellationReversed,
  deletionIsWorthAnnouncing,
  priceIdOf,
  type SubscriptionChanges,
  stripeCustomerUrl,
  tierChange,
} from 'src/services/stripeEvents.server';
import { StripeAdminService, StripeServiceServer } from 'src/services/stripeService.server';
import { getTenantDisplayName } from 'src/services/tenantSettingsService.server';
import { formatCurrency } from 'src/utils/currency';
import { methodNotAllowedError, validationError } from 'src/utils/httpException';
import type Stripe from 'stripe';

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== 'POST') {
    throw methodNotAllowedError();
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    throw validationError('Missing stripe-signature header');
  }

  const client = createSupabaseAdminServerClient();
  const stripeService = new StripeServiceServer(client);
  const stripeAdmin = new StripeAdminService();

  let event: Stripe.Event;
  try {
    const webhookSecret = await getSecret('STRIPE_WEBHOOK_SECRET');
    event = await StripeServiceServer.constructWebhookEvent(body, signature, webhookSecret);
  } catch (error) {
    logger.error('Webhook signature verification failed:', error);
    return new Response('Invalid signature', { status: 400 });
  }

  const tenantId = process.env.TENANT_ID;

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;
        const isActive = subscription.status === 'active';

        let authId = await stripeService.getAuthIdByStripeCustomerId(customerId, tenantId);
        if (!authId) {
          // Guest checkout: try matching by email and auto-link
          authId = await stripeService.getAuthIdByStripeCustomerEmail(customerId);
          if (authId && tenantId) {
            await stripeAdmin.linkCustomerToAuthUser(customerId, authId, tenantId);
          }
        }
        if (!authId) {
          console.warn('Stripe customer not linked to any user:', customerId);
          break;
        }

        if (tenantId && isActive) {
          const productId = subscription.items.data[0]?.price?.product as string;
          if (!productId) {
            console.warn('No product ID found on subscription:', subscription.id);
            break;
          }

          const badgeId = await stripeAdmin.getBadgeIdForProduct(productId);
          if (!badgeId) {
            console.warn('No badge mapping found for product:', productId);
            break;
          }

          await stripeAdmin.assignBadgeForSubscription(authId, tenantId, badgeId);
        } else if (tenantId && !isActive) {
          await stripeAdmin.removeTierBadges(authId, tenantId);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;

        let authId = await stripeService.getAuthIdByStripeCustomerId(customerId, tenantId);
        if (!authId) {
          authId = await stripeService.getAuthIdByStripeCustomerEmail(customerId);
        }
        if (!authId) {
          console.warn('Stripe customer not linked to any user:', customerId);
          break;
        }

        if (tenantId) {
          await stripeAdmin.removeTierBadges(authId, tenantId);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const customerId = invoice.customer as string;
        console.warn('Invoice payment failed for customer:', customerId, 'invoice:', invoice.id);
        break;
      }

      default:
        break;
    }

    await notifyMembershipEvent(event, client, stripeService, tenantId);

    return new Response('OK', { status: 200 });
  } catch (error) {
    logger.error('Webhook handler error:', error);
    return new Response('Webhook handler failed', { status: 500 });
  }
};

const MESSAGE_LOCALE = 'en-GB';

const NOTIFIED_EVENTS = [
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.payment_succeeded',
  'invoice.payment_failed',
];

async function notifyMembershipEvent(
  event: Stripe.Event,
  client: SupabaseClient,
  stripeService: StripeServiceServer,
  tenantId: string | undefined,
) {
  if (!tenantId || !NOTIFIED_EVENTS.includes(event.type)) {
    return;
  }

  const tierNameOf = (productId: string | undefined) =>
    productId ? stripeService.getTierNameForProduct(productId, tenantId) : null;

  const nameFor = async (customerId: string) => {
    const customer = await StripeServiceServer.getStripeCustomer(customerId);
    const profile = await stripeService.getProfileIdentityByStripeCustomerId(
      customerId,
      tenantId,
      customer?.email ?? null,
    );

    return supporterName(customer, profile);
  };

  try {
    const membership = membershipNotifications(
      (await getTenantDisplayName(client, tenantId)) ?? tenantId,
    );

    switch (event.type) {
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const changes = event.data.previous_attributes as SubscriptionChanges | undefined;

        if (cancellationJustScheduled(subscription, changes)) {
          membership.subscriptionCancelled(await nameFor(subscription.customer as string));
          break;
        }

        if (cancellationReversed(subscription, changes)) {
          membership.subscriptionResumed(await nameFor(subscription.customer as string));
          break;
        }

        const change = tierChange(subscription, changes);

        if (!change) {
          break;
        }

        const [name, fromTierName, toTierName] = await Promise.all([
          nameFor(subscription.customer as string),
          tierNameOf(change.from),
          tierNameOf(change.to),
        ]);

        if (fromTierName && toTierName) {
          membership.tierChanged(name, fromTierName, toTierName);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const changes = event.data.previous_attributes as SubscriptionChanges | undefined;
        if (!deletionIsWorthAnnouncing(subscription, changes)) {
          break;
        }

        membership.subscriptionCancelled(await nameFor(subscription.customer as string));
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        const billingReason = invoice.billing_reason;

        if (billingReason !== 'subscription_create' && billingReason !== 'subscription_cycle') {
          break;
        }

        const line = invoice.lines.data[0];
        const priceId = priceIdOf(line);

        const [name, tierName, interval] = await Promise.all([
          nameFor(invoice.customer as string),
          tierNameOf(line?.pricing?.price_details?.product),
          priceId ? StripeServiceServer.getPriceInterval(priceId) : null,
        ]);

        const amount = formatCurrency(invoice.amount_paid, invoice.currency, MESSAGE_LOCALE);

        if (billingReason === 'subscription_create') {
          membership.newSupporter(name, tierName, amount);
        } else {
          membership.recurringPayment(name, tierName, interval, amount);
        }
        break;
      }

      // Renewals only. A decline at signup fires this too, but the supporter is still on the
      // page and will usually just retry, so there is nothing for the team to act on.
      case 'invoice.payment_failed': {
        const invoice = event.data.object;

        if (invoice.billing_reason !== 'subscription_cycle') {
          break;
        }

        const customerId = invoice.customer as string;
        const line = invoice.lines.data[0];

        const [name, tierName] = await Promise.all([
          nameFor(customerId),
          tierNameOf(line?.pricing?.price_details?.product),
        ]);

        membership.paymentFailed(
          name,
          tierName,
          formatCurrency(invoice.amount_due, invoice.currency, MESSAGE_LOCALE),
          stripeCustomerUrl(customerId, event.livemode),
        );
        break;
      }

      default:
        break;
    }
  } catch (error) {
    logger.error('Membership notification failed:', error);
  }
}
