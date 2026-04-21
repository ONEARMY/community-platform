import type { ActionFunctionArgs } from 'react-router';
import { createSupabaseAdminServerClient } from 'src/repository/supabaseAdmin.server';
import { getSecret } from 'src/services/secretsService.server';
import { StripeServiceServer } from 'src/services/stripeService.server';
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

  let event: Stripe.Event;
  try {
    const webhookSecret = await getSecret('STRIPE_WEBHOOK_SECRET');
    event = await stripeService.constructWebhookEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
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
            await stripeService.linkCustomerToAuthUser(customerId, authId, tenantId);
          }
        }
        if (!authId) {
          console.warn('Stripe customer not linked to any user:', customerId);
          break;
        }

        if (tenantId) {
          await stripeService.updateSupporterStatus(authId, isActive, tenantId);
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
          await stripeService.updateSupporterStatus(authId, false, tenantId);
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

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return new Response('Webhook handler failed', { status: 500 });
  }
};
