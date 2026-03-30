import type { SupabaseClient } from '@supabase/supabase-js';
import { getSecret } from 'src/services/secretsService.server';
import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

const getStripe = async (): Promise<Stripe> => {
  if (stripeInstance) return stripeInstance;

  const key = await getSecret('STRIPE_SECRET_KEY');
  stripeInstance = new Stripe(key);
  return stripeInstance;
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

  const stripe = await getStripe();
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

type SubscriptionParams = {
  currency: string;
  interval: 'month' | 'year';
  amount: number;
  name?: string;
  email?: string;
};

const getProducts = async (): Promise<string[]> => {
  const stripe = await getStripe();

  const products = await stripe.products.list({ active: true, limit: 100 });

  if (!products.data.length) {
    throw new Error('No active Stripe products found');
  }

  return products.data.map((p) => p.id);
};

export type SupporterPrice = {
  id: string;
  unitAmount: number;
  currency: string;
  interval: 'month' | 'year';
  lookupKey: string | null;
};

const getPrices = async (): Promise<SupporterPrice[]> => {
  const stripe = await getStripe();
  const productIds = await getProducts();

  const allPrices = await Promise.all(
    productIds.map((productId) =>
      stripe.prices.list({
        product: productId,
        active: true,
        limit: 100,
      }),
    ),
  );

  return allPrices
    .flatMap((result) => result.data)
    .filter((p) => p.recurring && p.unit_amount !== null)
    .map((p) => ({
      id: p.id,
      unitAmount: p.unit_amount!,
      currency: p.currency,
      interval: p.recurring!.interval as 'month' | 'year',
      lookupKey: p.lookup_key ?? null,
    }));
};

const createSubscriptionWithPaymentIntent = async (
  customerId: string,
  params: SubscriptionParams,
): Promise<string> => {
  const stripe = await getStripe();

  const productIds = await getProducts();
  const productId = productIds[0];

  // Update customer with name/email if provided
  if (params.name || params.email) {
    await stripe.customers.update(customerId, {
      ...(params.name && { name: params.name }),
      ...(params.email && { email: params.email }),
    });
  }

  // Find an existing price matching currency/interval/amount, or create one
  const existingPrices = await stripe.prices.list({
    product: productId,
    active: true,
    currency: params.currency.toLowerCase(),
    limit: 100,
  });

  const matchingPrice = existingPrices.data.find(
    (p) => p.unit_amount === params.amount && p.recurring?.interval === params.interval,
  );

  const price =
    matchingPrice ??
    (await stripe.prices.create({
      unit_amount: params.amount,
      currency: params.currency.toLowerCase(),
      recurring: { interval: params.interval },
      product: productId,
    }));

  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: price.id }],
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
  const stripe = await getStripe();

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session.url;
};

const getSubscription = async (customerId: string): Promise<Stripe.Subscription | null> => {
  const stripe = await getStripe();

  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: 'active',
    limit: 1,
  });

  return subscriptions.data[0] || null;
};

const constructWebhookEvent = async (
  body: string,
  signature: string,
  secret: string,
): Promise<Stripe.Event> => {
  const stripe = await getStripe();
  return stripe.webhooks.constructEvent(body, signature, secret);
};

const updateSupporterStatus = async (
  authId: string,
  isSupporter: boolean,
  client: SupabaseClient,
): Promise<void> => {
  await client.from('profiles').update({ is_supporter: isSupporter }).eq('auth_id', authId);
};

const createGuestCustomer = async (email: string, name?: string): Promise<string> => {
  const stripe = await getStripe();
  const customer = await stripe.customers.create({
    email,
    ...(name && { name }),
  });
  return customer.id;
};

const getStripeCustomer = async (
  customerId: string,
): Promise<{ id: string; email: string | null } | null> => {
  const stripe = await getStripe();
  try {
    const customer = await stripe.customers.retrieve(customerId);
    if (customer.deleted) {
      return null;
    }
    return { id: customer.id, email: customer.email };
  } catch {
    return null;
  }
};

const linkCustomerToAuthUser = async (
  stripeCustomerId: string,
  authId: string,
  tenantId: string,
  client: SupabaseClient,
): Promise<void> => {
  const stripe = await getStripe();
  await stripe.customers.update(stripeCustomerId, {
    metadata: { supabase_user_id: authId, tenant_id: tenantId },
  });
  await client.from('stripe_customers').insert({
    auth_id: authId,
    stripe_customer_id: stripeCustomerId,
    tenant_id: tenantId,
  });
};

export const stripeServiceServer = {
  constructWebhookEvent,
  createBillingPortalSession,
  createGuestCustomer,
  createSubscriptionWithPaymentIntent,
  getAuthIdByStripeCustomerId,
  getCustomerByAuthId,
  getOrCreateCustomer,
  getPrices,
  getStripeCustomer,
  getSubscription,
  linkCustomerToAuthUser,
  updateSupporterStatus,
};
