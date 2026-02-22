import type { ActionFunctionArgs } from 'react-router';
import { createSupabaseAdminServerClient } from 'src/repository/supabaseAdmin.server';
import { stripeServiceServer } from 'src/services/stripeService.server';
import type Stripe from 'stripe';

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
  if (!STRIPE_WEBHOOK_SECRET) {
    console.error('STRIPE_WEBHOOK_SECRET not set');
    return new Response('Webhook secret not configured', { status: 500 });
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return new Response('No signature', { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripeServiceServer.constructWebhookEvent(body, signature, STRIPE_WEBHOOK_SECRET);
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

        const authId = await stripeServiceServer.getAuthIdByStripeCustomerId(customerId, client);
        if (!authId) {
          console.error('Stripe customer not found:', customerId);
          break;
        }

        await stripeServiceServer.updateSupporterStatus(authId, isActive, client);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;

        const authId = await stripeServiceServer.getAuthIdByStripeCustomerId(customerId, client);
        if (!authId) {
          console.error('Stripe customer not found:', customerId);
          break;
        }

        await stripeServiceServer.updateSupporterStatus(authId, false, client);
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
