import type { ActionFunctionArgs } from 'react-router';
import { createSupabaseAdminServerClient } from 'src/repository/supabaseAdmin.server';
import { getSecret } from 'src/services/secretsService.server';
import { stripeServiceServer } from 'src/services/stripeService.server';
import type Stripe from 'stripe';

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return new Response('No signature', { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const webhookSecret = await getSecret('STRIPE_WEBHOOK_SECRET');
    event = await stripeServiceServer.constructWebhookEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return new Response('Invalid signature', { status: 400 });
  }

  const client = createSupabaseAdminServerClient();

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;
        const isActive = subscription.status === 'active' || subscription.status === 'trialing';

        let authId = await stripeServiceServer.getAuthIdByStripeCustomerId(customerId, client);
        if (!authId) {
          // Guest checkout: try matching by email and auto-link
          authId = await stripeServiceServer.getAuthIdByStripeCustomerEmail(customerId, client);
          if (authId) {
            const tenantId = process.env.TENANT_ID;
            if (tenantId) {
              await stripeServiceServer.linkCustomerToAuthUser(
                customerId,
                authId,
                tenantId,
                client,
              );
            }
          }
        }
        if (!authId) {
          console.warn('Stripe customer not linked to any user:', customerId);
          break;
        }

        await stripeServiceServer.updateSupporterStatus(authId, isActive, client);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;

        let authId = await stripeServiceServer.getAuthIdByStripeCustomerId(customerId, client);
        if (!authId) {
          authId = await stripeServiceServer.getAuthIdByStripeCustomerEmail(customerId, client);
        }
        if (!authId) {
          console.warn('Stripe customer not linked to any user:', customerId);
          break;
        }

        await stripeServiceServer.updateSupporterStatus(authId, false, client);
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
