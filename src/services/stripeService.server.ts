import type { SupabaseClient } from '@supabase/supabase-js';
import { getSecret } from 'src/services/secretsService.server';
import Stripe from 'stripe';

export type SupporterPrice = {
  id: string;
  unitAmount: number;
  currency: string;
  interval: 'month' | 'year';
  tier: number | null;
  tierName: string | null;
};

export class StripeServiceServer {
  private static stripeInstance: Stripe | null = null;

  constructor(private client: SupabaseClient) {}

  private static async getStripe(): Promise<Stripe> {
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

  async getAuthIdByStripeCustomerId(
    stripeCustomerId: string,
    tenantId?: string,
  ): Promise<string | null> {
    let query = this.client
      .from('stripe_customers')
      .select('auth_id')
      .eq('stripe_customer_id', stripeCustomerId);

    if (tenantId) {
      query = query.eq('tenant_id', tenantId);
    }

    const { data } = await query.single();
    return data?.auth_id || null;
  }

  async createCustomer(authUserId: string, email: string, tenantId: string): Promise<string> {
    const stripe = await StripeServiceServer.getStripe();
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

  async getProductTierMap(): Promise<Map<string, { tier: number; tierName: string }>> {
    const { data } = await this.client
      .from('stripe_badge_products')
      .select('stripe_product_id, profile_badges:badge_id(premium_tier, display_name)');

    const map = new Map<string, { tier: number; tierName: string }>();
    if (!data) return map;

    for (const row of data) {
      const badge = row.profile_badges as unknown as {
        premium_tier: number | null;
        display_name: string;
      } | null;
      if (badge?.premium_tier != null) {
        map.set(row.stripe_product_id, {
          tier: badge.premium_tier,
          tierName: badge.display_name,
        });
      }
    }

    return map;
  }

  async getPrices(): Promise<SupporterPrice[]> {
    const stripe = await StripeServiceServer.getStripe();
    const tierMap = await this.getProductTierMap();
    const productIds = [...tierMap.keys()];

    if (!productIds.length) {
      throw new Error('No supporter products configured');
    }

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
      .map((p) => {
        const productId =
          typeof p.product === 'string' ? p.product : (p.product as { id: string })?.id;
        const tierInfo = productId ? tierMap.get(productId) : undefined;
        return {
          id: p.id,
          unitAmount: p.unit_amount!,
          currency: p.currency,
          interval: p.recurring!.interval as 'month' | 'year',
          tier: tierInfo?.tier ?? null,
          tierName: tierInfo?.tierName ?? null,
        };
      });
  }

  async createSubscriptionWithPaymentIntent(
    customerId: string,
    priceId: string,
    name?: string,
  ): Promise<string> {
    const stripe = await StripeServiceServer.getStripe();

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
    const stripe = await StripeServiceServer.getStripe();

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return session.url;
  }

  async getSubscription(customerId: string): Promise<Stripe.Subscription | null> {
    const stripe = await StripeServiceServer.getStripe();

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    });

    return subscriptions.data[0] || null;
  }

  static async constructWebhookEvent(
    body: string,
    signature: string,
    secret: string,
  ): Promise<Stripe.Event> {
    const stripe = await StripeServiceServer.getStripe();
    return stripe.webhooks.constructEvent(body, signature, secret);
  }

  async getBadgeIdForProduct(productId: string): Promise<number | null> {
    const { data } = await this.client
      .from('stripe_badge_products')
      .select('badge_id')
      .eq('stripe_product_id', productId)
      .single();

    return data?.badge_id ?? null;
  }

  async getProfileIdByAuthId(authId: string, tenantId: string): Promise<number | null> {
    const { data } = await this.client
      .from('profiles')
      .select('id')
      .eq('auth_id', authId)
      .eq('tenant_id', tenantId)
      .single();

    return data?.id ?? null;
  }

  async assignBadgeForSubscription(
    authId: string,
    tenantId: string,
    badgeId: number,
  ): Promise<void> {
    const profileId = await this.getProfileIdByAuthId(authId, tenantId);
    if (!profileId) {
      console.warn('No profile found for auth_id:', authId);
      return;
    }

    // Get all badge IDs that are stripe-linked tier badges
    const { data: tierBadges } = await this.client
      .from('stripe_badge_products')
      .select('badge_id')
      .eq('tenant_id', tenantId);

    const tierBadgeIds = [...new Set(tierBadges?.map((b) => b.badge_id) ?? [])];

    // Remove any existing tier badges for this profile
    if (tierBadgeIds.length > 0) {
      await this.client
        .from('profile_badges_relations')
        .delete()
        .eq('profile_id', profileId)
        .eq('tenant_id', tenantId)
        .in('profile_badge_id', tierBadgeIds);
    }

    // Assign the new badge
    await this.client.from('profile_badges_relations').insert({
      profile_id: profileId,
      profile_badge_id: badgeId,
      tenant_id: tenantId,
    });
  }

  async removeTierBadges(authId: string, tenantId: string): Promise<void> {
    const profileId = await this.getProfileIdByAuthId(authId, tenantId);
    if (!profileId) {
      console.warn('No profile found for auth_id:', authId);
      return;
    }

    const { data: tierBadges } = await this.client
      .from('stripe_badge_products')
      .select('badge_id')
      .eq('tenant_id', tenantId);

    const tierBadgeIds = [...new Set(tierBadges?.map((b) => b.badge_id) ?? [])];

    if (tierBadgeIds.length > 0) {
      await this.client
        .from('profile_badges_relations')
        .delete()
        .eq('profile_id', profileId)
        .eq('tenant_id', tenantId)
        .in('profile_badge_id', tierBadgeIds);
    }
  }

  async createGuestCustomer(email: string, name?: string): Promise<string> {
    const stripe = await StripeServiceServer.getStripe();

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
    const stripe = await StripeServiceServer.getStripe();
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
    const stripe = await StripeServiceServer.getStripe();
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
