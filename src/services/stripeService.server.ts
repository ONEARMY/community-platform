import type { SupabaseClient } from '@supabase/supabase-js';
import { createSupabaseAdminServerClient } from 'src/repository/supabaseAdmin.server';
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

export type TierConfigMap = Record<number, { color: string; name: string; description: string }>;

const STUB_PRICES: SupporterPrice[] = [
  {
    id: 'stub_starter_month',
    unitAmount: 100,
    currency: 'eur',
    interval: 'month',
    tier: 1,
    tierName: 'Starter',
  },
  {
    id: 'stub_starter_year',
    unitAmount: 100,
    currency: 'eur',
    interval: 'year',
    tier: 1,
    tierName: 'Starter',
  },
  {
    id: 'stub_hero_month',
    unitAmount: 200,
    currency: 'eur',
    interval: 'month',
    tier: 2,
    tierName: 'Hero',
  },
  {
    id: 'stub_hero_year',
    unitAmount: 200,
    currency: 'eur',
    interval: 'year',
    tier: 2,
    tierName: 'Hero',
  },
  {
    id: 'stub_legend_month',
    unitAmount: 300,
    currency: 'eur',
    interval: 'month',
    tier: 3,
    tierName: 'Legend',
  },
  {
    id: 'stub_legend_year',
    unitAmount: 300,
    currency: 'eur',
    interval: 'year',
    tier: 3,
    tierName: 'Legend',
  },
];

const STUB_TIER_CONFIG: { tiers: TierConfigMap; thankYouImageUrl: string | null } = {
  tiers: {
    1: {
      color: '#BFDEBA',
      name: 'Starter',
      description: 'You help us develop new features, get videos in 4K without ads!',
    },
    2: {
      color: '#77BDE3',
      name: 'Hero',
      description: 'You help us develop new features, get videos in 4K without ads!',
    },
    3: {
      color: '#FEE77B',
      name: 'Legend',
      description: 'You help us develop new features, get videos in 4K without ads!',
    },
  },
  thankYouImageUrl: null,
};

let stripeInstance: Stripe | null = null;
let stripeUnavailable = false;

async function getStripe(): Promise<Stripe | null> {
  if (stripeInstance) {
    return stripeInstance;
  }
  if (stripeUnavailable) {
    return null;
  }

  try {
    const key = await getSecret('STRIPE_SECRET_KEY');
    stripeInstance = new Stripe(key);
    return stripeInstance;
  } catch {
    stripeUnavailable = true;
    return null;
  }
}

export class StripeServiceServer {
  constructor(private client: SupabaseClient) {}

  // ── Static Stripe-API-only methods (no DB access) ──

  static async getStripeCustomer(
    customerId: string,
  ): Promise<{ id: string; email: string | null } | null> {
    const stripe = await getStripe();
    if (!stripe) {
      return null;
    }
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

  static async getSubscription(customerId: string): Promise<Stripe.Subscription | null> {
    const stripe = await getStripe();
    if (!stripe) {
      return null;
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    });

    return subscriptions.data[0] || null;
  }

  static async createGuestCustomer(email: string, name?: string): Promise<string> {
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Stripe is not configured');
    }

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

  static async createSubscriptionWithPaymentIntent(
    customerId: string,
    priceId: string,
    currency: string,
    name?: string,
  ): Promise<string> {
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Stripe is not configured');
    }

    if (name) {
      await stripe.customers.update(customerId, { name });
    }

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      currency,
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

  static async createBillingPortalSession(customerId: string, returnUrl: string): Promise<string> {
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Stripe is not configured');
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return session.url;
  }

  static async constructWebhookEvent(
    body: string,
    signature: string,
    secret: string,
  ): Promise<Stripe.Event> {
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Stripe is not configured');
    }
    return stripe.webhooks.constructEvent(body, signature, secret);
  }

  // ── Instance methods (request-scoped DB reads/writes via passed client) ──

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
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Stripe is not configured');
    }
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
    if (!data) {
      return map;
    }

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

  async getTierConfig(): Promise<{ tiers: TierConfigMap; thankYouImageUrl: string | null }> {
    const { data } = await this.client
      .from('stripe_tier_config')
      .select(
        'description, color, thank_you_image_url, profile_badges:badge_id(premium_tier, display_name)',
      );

    let thankYouImageUrl: string | null = null;

    if (!data || data.length === 0) {
      const stripe = await getStripe();
      if (!stripe && process.env.NODE_ENV === 'development') {
        return STUB_TIER_CONFIG;
      }
      return { tiers: {}, thankYouImageUrl };
    }

    const map: TierConfigMap = {};
    for (const row of data) {
      const badge = row.profile_badges as unknown as {
        premium_tier: number | null;
        display_name: string;
      } | null;
      if (badge?.premium_tier != null) {
        map[badge.premium_tier] = {
          color: row.color,
          name: badge.display_name,
          description: row.description,
        };
      }
      if (!thankYouImageUrl && (row as any).thank_you_image_url) {
        thankYouImageUrl = (row as any).thank_you_image_url;
      }
    }

    return { tiers: map, thankYouImageUrl };
  }

  async getPrices(): Promise<SupporterPrice[]> {
    const stripe = await getStripe();
    if (!stripe) {
      return process.env.NODE_ENV === 'development' ? STUB_PRICES : [];
    }
    const tierMap = await this.getProductTierMap();
    const productIds = [...tierMap.keys()];

    if (!productIds.length) {
      return [];
    }

    const allPrices = await Promise.all(
      productIds.map((productId) =>
        stripe.prices.list({
          product: productId,
          active: true,
          limit: 100,
          expand: ['data.currency_options'],
        }),
      ),
    );

    return allPrices
      .flatMap((result) => result.data)
      .filter((p) => p.recurring && p.unit_amount !== null)
      .flatMap((p) => {
        const productId =
          typeof p.product === 'string' ? p.product : (p.product as { id: string })?.id;
        const tierInfo = productId ? tierMap.get(productId) : undefined;

        const baseEntry: SupporterPrice = {
          id: p.id,
          unitAmount: p.unit_amount!,
          currency: p.currency,
          interval: p.recurring!.interval as 'month' | 'year',
          tier: tierInfo?.tier ?? null,
          tierName: tierInfo?.tierName ?? null,
        };

        const entries: SupporterPrice[] = [baseEntry];

        // Flatten currency_options into additional entries so the frontend
        // can filter by currency without knowing about multi-currency prices.
        if (p.currency_options) {
          for (const [cur, opts] of Object.entries(p.currency_options)) {
            if (cur === p.currency) {
              continue; // skip duplicate of base currency
            }
            const amount =
              opts.unit_amount ??
              (opts.unit_amount_decimal ? Math.round(parseFloat(opts.unit_amount_decimal)) : null);
            if (amount != null) {
              entries.push({
                id: p.id,
                unitAmount: amount,
                currency: cur,
                interval: p.recurring!.interval as 'month' | 'year',
                tier: tierInfo?.tier ?? null,
                tierName: tierInfo?.tierName ?? null,
              });
            }
          }
        }

        return entries;
      });
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

  async getAuthIdByStripeCustomerEmail(stripeCustomerId: string): Promise<string | null> {
    const customer = await StripeServiceServer.getStripeCustomer(stripeCustomerId);
    if (!customer?.email) {
      return null;
    }

    const { data } = await this.client.rpc('get_user_id_by_email', { email: customer.email });
    if (!Array.isArray(data) || data.length === 0) {
      return null;
    }

    return data[0].id;
  }
}

// privileged DB writes that bypass RLS

export class StripeAdminService {
  private client: SupabaseClient;

  constructor() {
    this.client = createSupabaseAdminServerClient();
  }

  async linkCustomerToAuthUser(
    stripeCustomerId: string,
    authId: string,
    tenantId: string,
  ): Promise<void> {
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Stripe is not configured');
    }
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

  async getBadgeIdForProduct(productId: string): Promise<number | null> {
    const { data } = await this.client
      .from('stripe_badge_products')
      .select('badge_id')
      .eq('stripe_product_id', productId)
      .single();

    return data?.badge_id ?? null;
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

  private async getProfileIdByAuthId(authId: string, tenantId: string): Promise<number | null> {
    const { data } = await this.client
      .from('profiles')
      .select('id')
      .eq('auth_id', authId)
      .eq('tenant_id', tenantId)
      .single();

    return data?.id ?? null;
  }
}
