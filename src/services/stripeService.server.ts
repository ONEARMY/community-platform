import type { SupabaseClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const getStripe = () => {
  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

  if (!STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY must be set');
  }

  return new Stripe(STRIPE_SECRET_KEY);
};

const getCustomerByAuthId = async (
  authId: string,
  client: SupabaseClient,
): Promise<string | null> => {
  const { data } = await client
    .from('stripe_customers')
    .select('stripe_customer_id')
    .eq('auth_id', authId)
    .single();

  return data?.stripe_customer_id || null;
};

const getAuthIdByStripeCustomerId = async (
  stripeCustomerId: string,
  client: SupabaseClient,
): Promise<string | null> => {
  const { data } = await client
    .from('stripe_customers')
    .select('auth_id')
    .eq('stripe_customer_id', stripeCustomerId)
    .single();

  return data?.auth_id || null;
};

const getOrCreateCustomer = async (
  authUserId: string,
  email: string,
  tenantId: string,
  client: SupabaseClient,
): Promise<string> => {
  const existingCustomerId = await getCustomerByAuthId(authUserId, client);
  if (existingCustomerId) {
    return existingCustomerId;
  }

  const stripe = getStripe();
  const customer = await stripe.customers.create({
    email,
    metadata: {
      supabase_user_id: authUserId,
      tenant_id: tenantId,
    },
  });

  await client.from('stripe_customers').insert({
    auth_id: authUserId,
    stripe_customer_id: customer.id,
    tenant_id: tenantId,
  });

  return customer.id;
};

// --- Variant: Redirect ---
const createCheckoutSession = async (
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string,
): Promise<string> => {
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  if (!session.url) {
    throw new Error('Failed to create checkout session');
  }

  return session.url;
};

// --- Variant: Embedded ---
const createEmbeddedCheckoutSession = async (
  customerId: string,
  priceId: string,
  returnUrl: string,
): Promise<string> => {
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    ui_mode: 'embedded',
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    return_url: returnUrl,
  });

  if (!session.client_secret) {
    throw new Error('Failed to create embedded checkout session');
  }

  return session.client_secret;
};

// --- Variant: Elements ---
const createSubscriptionWithPaymentIntent = async (
  customerId: string,
  priceId: string,
): Promise<string> => {
  const stripe = getStripe();

  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    expand: ['latest_invoice'],
  });

  const invoice = subscription.latest_invoice as Stripe.Invoice;

  const invoicePayments = await stripe.invoicePayments.list({
    invoice: invoice.id,
    expand: ['data.payment.payment_intent'],
  });

  const paymentIntent = invoicePayments.data[0]?.payment?.payment_intent as
    | Stripe.PaymentIntent
    | undefined;

  if (!paymentIntent?.client_secret) {
    throw new Error('Failed to get payment intent client secret');
  }

  return paymentIntent.client_secret;
};

const createBillingPortalSession = async (
  customerId: string,
  returnUrl: string,
): Promise<string> => {
  const stripe = getStripe();

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session.url;
};

const getSubscription = async (customerId: string): Promise<Stripe.Subscription | null> => {
  const stripe = getStripe();

  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: 'active',
    limit: 1,
  });

  return subscriptions.data[0] || null;
};

const constructWebhookEvent = (body: string, signature: string, secret: string): Stripe.Event => {
  const stripe = getStripe();
  return stripe.webhooks.constructEvent(body, signature, secret);
};

const updateSupporterStatus = async (
  authId: string,
  isSupporter: boolean,
  client: SupabaseClient,
): Promise<void> => {
  await client.from('profiles').update({ is_supporter: isSupporter }).eq('auth_id', authId);
};

export const stripeServiceServer = {
  constructWebhookEvent,
  createBillingPortalSession,
  createCheckoutSession,
  createEmbeddedCheckoutSession,
  createSubscriptionWithPaymentIntent,
  getAuthIdByStripeCustomerId,
  getCustomerByAuthId,
  getOrCreateCustomer,
  getSubscription,
  updateSupporterStatus,
};
