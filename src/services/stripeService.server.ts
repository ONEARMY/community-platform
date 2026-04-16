import type { SupabaseClient } from '@supabase/supabase-js';
import { getSecret } from 'src/services/secretsService.server';
import Stripe from 'stripe';

export type SupporterPrice = {
  id: string;
  unitAmount: number;
  currency: string;
  interval: 'month' | 'year';
};

export class StripeServiceServer {
  private static stripeInstance: Stripe | null = null;
  private static cachedProductIds: string[] | null = null;

  constructor(private client: SupabaseClient) {}

  private async getStripe(): Promise<Stripe> {
    if (StripeServiceServer.stripeInstance) return StripeServiceServer.stripeInstance;

    const key = await getSecret('STRIPE_SECRET_KEY');
    StripeServiceServer.stripeInstance = new Stripe(key);
    return StripeServiceServer.stripeInstance;
  }

  async getCustomerByAuthId(authId: string): Promise<string | null> {
    const { data } = await this.client
      .from('stripe_customers')
      .select('stripe_customer_id')
      .eq('auth_id', authId)
      .single();

    return data?.stripe_customer_id || null;
  }

  async getAuthIdByStripeCustomerId(stripeCustomerId: string): Promise<string | null> {
    const { data } = await this.client
      .from('stripe_customers')
      .select('auth_id')
      .eq('stripe_customer_id', stripeCustomerId)
      .single();

    return data?.auth_id || null;
  }

  async createCustomer(authUserId: string, email: string, tenantId: string): Promise<string> {
    const stripe = await this.getStripe();
    const customer = await stripe.customers.create({
      email,
      metadata: {
        supabase_user_id: authUserId,
        tenant_id: tenantId,
      },
    });

    await this.client.from('stripe_customers').insert({
      auth_id: authUserId,
      stripe_customer_id: customer.id,
      tenant_id: tenantId,
    });

    return customer.id;
  }

  async getOrCreateCustomer(authUserId: string, email: string, tenantId: string): Promise<string> {
    const existingCustomerId = await this.getCustomerByAuthId(authUserId);
    if (existingCustomerId) {
      return existingCustomerId;
    }
    return this.createCustomer(authUserId, email, tenantId);
  }

  async getProducts(): Promise<string[]> {
    if (StripeServiceServer.cachedProductIds) return StripeServiceServer.cachedProductIds;

    const stripe = await this.getStripe();
    const products = await stripe.products.list({ active: true, limit: 100 });

    if (!products.data.length) {
      throw new Error('No active Stripe products found');
    }

    StripeServiceServer.cachedProductIds = products.data.map((p) => p.id);
    return StripeServiceServer.cachedProductIds;
  }

  async getPrices(): Promise<SupporterPrice[]> {
    const stripe = await this.getStripe();
    const productIds = await this.getProducts();

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
      }));
  }

  async createSubscriptionWithPaymentIntent(
    customerId: string,
    priceId: string,
    name?: string,
  ): Promise<string> {
    const stripe = await this.getStripe();

    if (name) {
      await stripe.customers.update(customerId, { name });
    }

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
  }

  async createBillingPortalSession(customerId: string, returnUrl: string): Promise<string> {
    const stripe = await this.getStripe();

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return session.url;
  }

  async getSubscription(customerId: string): Promise<Stripe.Subscription | null> {
    const stripe = await this.getStripe();

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    });

    return subscriptions.data[0] || null;
  }

  async constructWebhookEvent(
    body: string,
    signature: string,
    secret: string,
  ): Promise<Stripe.Event> {
    const stripe = await this.getStripe();
    return stripe.webhooks.constructEvent(body, signature, secret);
  }

  async updateSupporterStatus(
    authId: string,
    isSupporter: boolean,
    tenantId: string,
  ): Promise<void> {
    await this.client
      .from('profiles')
      .update({ is_supporter: isSupporter })
      .eq('auth_id', authId)
      .eq('tenant_id', tenantId);
  }

  async createGuestCustomer(email: string, name?: string): Promise<string> {
    const stripe = await this.getStripe();

    const existing = await stripe.customers.list({ email, limit: 1 });
    if (existing.data.length > 0) {
      return existing.data[0].id;
    }

    const customer = await stripe.customers.create({
      email,
      ...(name && { name }),
    });
    return customer.id;
  }

  async getStripeCustomer(
    customerId: string,
  ): Promise<{ id: string; email: string | null } | null> {
    const stripe = await this.getStripe();
    try {
      const customer = await stripe.customers.retrieve(customerId);
      if (customer.deleted) {
        return null;
      }
      return { id: customer.id, email: customer.email };
    } catch {
      return null;
    }
  }

  async linkCustomerToAuthUser(
    stripeCustomerId: string,
    authId: string,
    tenantId: string,
  ): Promise<void> {
    const stripe = await this.getStripe();
    await stripe.customers.update(stripeCustomerId, {
      metadata: { supabase_user_id: authId, tenant_id: tenantId },
    });
    await this.client.from('stripe_customers').upsert(
      {
        auth_id: authId,
        stripe_customer_id: stripeCustomerId,
        tenant_id: tenantId,
      },
      { onConflict: 'auth_id,tenant_id' },
    );
  }

  async getAuthIdByStripeCustomerEmail(stripeCustomerId: string): Promise<string | null> {
    const customer = await this.getStripeCustomer(stripeCustomerId);
    if (!customer?.email) return null;

    const { data } = await this.client.rpc('get_user_id_by_email', { email: customer.email });
    if (!Array.isArray(data) || data.length === 0) return null;

    return data[0].id;
  }
}
