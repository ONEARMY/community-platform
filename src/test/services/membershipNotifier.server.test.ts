import { discordServiceServer } from 'src/services/discordService.server';
import { notifyMembershipEvent } from 'src/services/membershipNotifier.server';
import { StripeServiceServer } from 'src/services/stripeService.server';
import type Stripe from 'stripe';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('src/services/discordService.server');

const TENANT_ID = 'precious-plastic';
const SITE_URL = 'https://community.preciousplastic.com';
const MEMBERSHIP_WEBHOOK = 'https://discord.com/api/webhooks/membership';
const CUSTOMER_ID = 'cus_1';
const STRIPE_CUSTOMER_URL = `https://dashboard.stripe.com/customers/${CUSTOMER_ID}`;

const stripeService = {
  getTierNameForProduct: vi.fn(),
  getProfileIdentityByStripeCustomerId: vi.fn(),
} as unknown as StripeServiceServer;

const notify = (event: unknown) =>
  notifyMembershipEvent(event as Stripe.Event, stripeService, TENANT_ID, SITE_URL);

const posted = () => vi.mocked(discordServiceServer.postWebhookRequest).mock.calls;
const lastMessage = () => posted()[0]?.[0];

const invoiceEvent = (
  type: 'invoice.payment_succeeded' | 'invoice.payment_failed',
  billingReason: string,
  overrides: Record<string, unknown> = {},
  livemode = true,
) => ({
  type,
  livemode,
  data: {
    object: {
      customer: CUSTOMER_ID,
      billing_reason: billingReason,
      currency: 'eur',
      amount_paid: 1000,
      amount_due: 1000,
      lines: {
        data: [{ pricing: { price_details: { product: 'prod_legend', price: 'price_1' } } }],
      },
      ...overrides,
    },
  },
});

const subscriptionEvent = (
  type: 'customer.subscription.updated' | 'customer.subscription.deleted',
  object: Record<string, unknown>,
  previous?: Record<string, unknown>,
) => ({
  type,
  livemode: true,
  data: {
    object: {
      customer: CUSTOMER_ID,
      status: 'active',
      cancel_at: null,
      items: { data: [] },
      ...object,
    },
    previous_attributes: previous,
  },
});

describe('notifyMembershipEvent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('DISCORD_MEMBERSHIP_WEBHOOK_URL', MEMBERSHIP_WEBHOOK);

    vi.spyOn(StripeServiceServer, 'getStripeCustomer').mockResolvedValue({
      id: CUSTOMER_ID,
      email: 'michael@example.com',
      name: 'Michael',
    });
    vi.spyOn(StripeServiceServer, 'getPriceInterval').mockResolvedValue('month');

    vi.mocked(stripeService.getTierNameForProduct).mockResolvedValue('Legend');
    vi.mocked(stripeService.getProfileIdentityByStripeCustomerId).mockResolvedValue(null);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  describe('events it ignores', () => {
    it('says nothing without a tenant', async () => {
      await notifyMembershipEvent(
        invoiceEvent('invoice.payment_succeeded', 'subscription_create') as unknown as Stripe.Event,
        stripeService,
        undefined,
        SITE_URL,
      );

      expect(discordServiceServer.postWebhookRequest).not.toHaveBeenCalled();
    });

    it('says nothing for an event type it does not announce', async () => {
      await notify({ type: 'customer.subscription.created', livemode: true, data: { object: {} } });

      expect(discordServiceServer.postWebhookRequest).not.toHaveBeenCalled();
    });

    it('stays quiet for a mid-cycle invoice from a tier change', async () => {
      await notify(invoiceEvent('invoice.payment_succeeded', 'subscription_update'));

      expect(discordServiceServer.postWebhookRequest).not.toHaveBeenCalled();
    });

    it('stays quiet for a card declined at signup', async () => {
      await notify(invoiceEvent('invoice.payment_failed', 'subscription_create'));

      expect(discordServiceServer.postWebhookRequest).not.toHaveBeenCalled();
    });
  });

  describe('a new supporter', () => {
    it('reports the name, tier and amount paid', async () => {
      await notify(invoiceEvent('invoice.payment_succeeded', 'subscription_create'));

      expect(lastMessage()).toContain('Michael is now a new Legend Supporter (€10)');
    });

    it('reads the amount actually paid, not the amount due', async () => {
      await notify(
        invoiceEvent('invoice.payment_succeeded', 'subscription_create', {
          amount_paid: 2500,
          amount_due: 9900,
        }),
      );

      expect(lastMessage()).toContain('(€25)');
    });

    // en-GB disambiguates a non-local currency, so dollars read as US$ rather than $
    it('uses the invoice currency', async () => {
      await notify(
        invoiceEvent('invoice.payment_succeeded', 'subscription_create', { currency: 'usd' }),
      );

      expect(lastMessage()).toContain('(US$10)');
    });

    it('links to the profile once the supporter has one', async () => {
      vi.mocked(stripeService.getProfileIdentityByStripeCustomerId).mockResolvedValue({
        id: 11,
        displayName: 'Big Mike',
      });

      await notify(invoiceEvent('invoice.payment_succeeded', 'subscription_create'));

      expect(lastMessage()).toContain(`<${SITE_URL}/u/11>`);
      expect(lastMessage()).toContain('Big Mike');
    });

    // A guest checkout has no profile until they set a password on the thank you page
    it('falls back to the Stripe customer when there is no profile yet', async () => {
      await notify(invoiceEvent('invoice.payment_succeeded', 'subscription_create'));

      expect(lastMessage()).toContain(`<${STRIPE_CUSTOMER_URL}>`);
    });

    it('points at the test dashboard for a test mode event', async () => {
      await notify(invoiceEvent('invoice.payment_succeeded', 'subscription_create', {}, false));

      expect(lastMessage()).toContain('dashboard.stripe.com/test/customers/');
    });

    it('still announces when the tier cannot be resolved', async () => {
      vi.mocked(stripeService.getTierNameForProduct).mockResolvedValue(null);

      await notify(invoiceEvent('invoice.payment_succeeded', 'subscription_create'));

      expect(lastMessage()).toContain('Michael is now a new Supporter (€10)');
    });
  });

  describe('a renewal', () => {
    it('reports the billing interval from the price', async () => {
      await notify(invoiceEvent('invoice.payment_succeeded', 'subscription_cycle'));

      expect(lastMessage()).toBe('Michael paid their monthly Legend membership (€10)');
    });

    it('drops the interval when the price is not a plain recurring one', async () => {
      vi.spyOn(StripeServiceServer, 'getPriceInterval').mockResolvedValue(null);

      await notify(invoiceEvent('invoice.payment_succeeded', 'subscription_cycle'));

      expect(lastMessage()).toBe('Michael paid their Legend membership (€10)');
    });

    it('does not link anywhere', async () => {
      await notify(invoiceEvent('invoice.payment_succeeded', 'subscription_cycle'));

      expect(lastMessage()).not.toContain('<');
    });
  });

  describe('a failed renewal', () => {
    it('reports the amount due and links to Stripe', async () => {
      await notify(
        invoiceEvent('invoice.payment_failed', 'subscription_cycle', {
          amount_paid: 0,
          amount_due: 1000,
        }),
      );

      expect(lastMessage()).toBe(
        `Michael had a failed payment for their Legend membership (€10)\n<${STRIPE_CUSTOMER_URL}>`,
      );
    });
  });

  describe('cancelling', () => {
    it('announces a cancellation the moment it is scheduled', async () => {
      await notify(
        subscriptionEvent(
          'customer.subscription.updated',
          { cancel_at: 1893456000 },
          { cancel_at: null },
        ),
      );

      expect(lastMessage()).toBe('Michael canceled their support');
    });

    it('announces a subscription deleted outright', async () => {
      await notify(subscriptionEvent('customer.subscription.deleted', { status: 'canceled' }));

      expect(lastMessage()).toBe('Michael canceled their support');
    });

    it('does not announce the deletion of an already scheduled cancellation', async () => {
      await notify(
        subscriptionEvent('customer.subscription.deleted', {
          status: 'canceled',
          cancel_at: 1893456000,
        }),
      );

      expect(discordServiceServer.postWebhookRequest).not.toHaveBeenCalled();
    });

    it('does not announce an abandoned checkout', async () => {
      await notify(
        subscriptionEvent('customer.subscription.deleted', { status: 'incomplete_expired' }),
      );

      expect(discordServiceServer.postWebhookRequest).not.toHaveBeenCalled();
    });

    it('announces a reversed cancellation', async () => {
      await notify(
        subscriptionEvent(
          'customer.subscription.updated',
          { cancel_at: null },
          { cancel_at: 1893456000 },
        ),
      );

      expect(lastMessage()).toBe('Michael changed their mind and resumed their support');
    });
  });

  describe('a tier change', () => {
    const upgrade = subscriptionEvent(
      'customer.subscription.updated',
      { items: { data: [{ price: { product: 'prod_hero' } }] } },
      { items: { data: [{ price: { product: 'prod_legend' } }] } },
    );

    it('names the tier on each side of the switch', async () => {
      vi.mocked(stripeService.getTierNameForProduct).mockImplementation(async (productId) =>
        productId === 'prod_hero' ? 'Hero' : 'Legend',
      );

      await notify(upgrade);

      expect(lastMessage()).toBe('Michael changed their membership from Legend to Hero');
    });

    it('stays quiet rather than naming a tier it cannot resolve', async () => {
      vi.mocked(stripeService.getTierNameForProduct).mockResolvedValue(null);

      await notify(upgrade);

      expect(discordServiceServer.postWebhookRequest).not.toHaveBeenCalled();
    });

    it('says nothing when the update did not touch the product', async () => {
      await notify(
        subscriptionEvent(
          'customer.subscription.updated',
          { items: { data: [{ price: { product: 'prod_legend' } }] } },
          { items: { data: [{ price: { product: 'prod_legend' } }] } },
        ),
      );

      expect(discordServiceServer.postWebhookRequest).not.toHaveBeenCalled();
    });
  });

  describe('when something goes wrong', () => {
    it('swallows the failure so the webhook still returns 200', async () => {
      vi.spyOn(StripeServiceServer, 'getStripeCustomer').mockRejectedValue(
        new Error('Stripe down'),
      );

      await expect(
        notify(invoiceEvent('invoice.payment_succeeded', 'subscription_create')),
      ).resolves.toBeUndefined();

      expect(discordServiceServer.postWebhookRequest).not.toHaveBeenCalled();
    });
  });
});
