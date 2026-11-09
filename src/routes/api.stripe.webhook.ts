import type { ActionFunctionArgs } from 'react-router';
import { logger } from 'src/logger';
import { createSupabaseAdminServerClient } from 'src/repository/supabaseAdmin.server';
import { notifyMembershipEvent } from 'src/services/membershipNotifier.server';
import { getSecret } from 'src/services/secretsService.server';
import { StripeAdminService, StripeServiceServer } from 'src/services/stripeService.server';
import { sendMembershipWelcomeEmail } from 'src/services/welcomeEmailService.server';
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
        if (!authId && isActive) {
          // Guest checkout: try matching by email and auto-link
          authId = await stripeService.getAuthIdByStripeCustomerEmail(customerId);
          if (authId && tenantId) {
            await stripeAdmin.linkCustomerToAuthUser(customerId, authId, tenantId);
          }
        }
        if (!authId) {
          if (isActive) {
            logger.info(
              `Stripe customer ${customerId} paid for subscription ${subscription.id} but no account matches their email yet. They get their badge when they create or link an account. No action needed.`,
            );
          }
          break;
        }

        if (tenantId && isActive) {
          const productId = subscription.items.data[0]?.price?.product as string;
          if (!productId) {
            logger.warn(
              `Subscription ${subscription.id} has no product, so Stripe customer ${customerId} did not get a badge.`,
            );
            break;
          }

          const badgeId = await stripeAdmin.getBadgeIdForProduct(productId);
          if (!badgeId) {
            logger.warn(
              `No badge is linked to Stripe product ${productId}, so subscription ${subscription.id} did not get a badge. Link the product to a badge in Admin > Badges.`,
            );
            break;
          }

          await stripeAdmin.assignBadgeForSubscription(authId, tenantId, badgeId);
        } else if (tenantId && !(await StripeServiceServer.getSubscription(customerId))) {
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
          logger.info(
            `Subscription ${subscription.id} ended for Stripe customer ${customerId}, who has no account, so there is no badge to remove. No action needed.`,
          );
          break;
        }

        if (tenantId && !(await StripeServiceServer.getSubscription(customerId))) {
          await stripeAdmin.removeTierBadges(authId, tenantId);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const customerId = invoice.customer as string;

        if (invoice.billing_reason === 'subscription_create') {
          logger.info(
            `First payment failed for a new subscription by Stripe customer ${customerId} (invoice ${invoice.id}). The supporter can try again at checkout. No action needed.`,
          );
          break;
        }

        logger.warn(
          `Renewal payment failed for Stripe customer ${customerId} (invoice ${invoice.id}, attempt ${invoice.attempt_count}). ${
            invoice.next_payment_attempt
              ? 'Stripe will retry automatically.'
              : 'Stripe has stopped retrying. Check the subscription in Stripe.'
          }`,
        );
        break;
      }

      default:
        break;
    }

    const siteUrl = new URL(request.url).origin.replace('http:', 'https:');

    await notifyMembershipEvent(event, stripeService, tenantId, siteUrl);
    await sendMembershipWelcomeEmail(event, stripeService, client, tenantId, siteUrl);

    return new Response('OK', { status: 200 });
  } catch (error) {
    logger.error('Webhook handler error:', error);
    return new Response('Webhook handler failed', { status: 500 });
  }
};
