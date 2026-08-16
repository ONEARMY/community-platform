import type { SupabaseClient } from '@supabase/supabase-js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  mockPricesList,
  mockList,
  mockCancel,
  mockCreate,
  mockCustomersList,
  mockCustomersUpdate,
  mockCustomersCreate,
  mockInvoicePaymentsList,
  mockGetSecret,
  mockLoggerError,
} = vi.hoisted(() => ({
  mockPricesList: vi.fn(),
  mockList: vi.fn(),
  mockCancel: vi.fn(),
  mockCreate: vi.fn(),
  mockCustomersList: vi.fn(),
  mockCustomersUpdate: vi.fn(),
  mockCustomersCreate: vi.fn(),
  mockInvoicePaymentsList: vi.fn(),
  mockGetSecret: vi.fn(),
  mockLoggerError: vi.fn(),
}));

vi.mock('stripe', () => ({
  __esModule: true,
  default: class {
    prices = { list: mockPricesList };
    subscriptions = { list: mockList, cancel: mockCancel, create: mockCreate };
    customers = { list: mockCustomersList, update: mockCustomersUpdate, create: mockCustomersCreate };
    invoicePayments = { list: mockInvoicePaymentsList };
  },
}));

vi.mock('src/services/secretsService.server', () => ({
  getSecret: mockGetSecret,
}));

vi.mock('src/repository/supabaseAdmin.server', () => ({
  createSupabaseAdminServerClient: vi.fn(),
}));

// stripeService.server.ts is re-imported fresh per test via vi.resetModules()
// in loadService() below, so a vi.spyOn() on an already-imported `logger`
// instance would watch a stale module - this mock survives resetModules().
vi.mock('src/logger', () => ({
  logger: { error: mockLoggerError },
}));

import { StripeServiceServer } from './stripeService.server';

type StripePrice = {
  id: string;
  unit_amount: number | null;
  currency: string;
  recurring: { interval: string } | null;
  product: { id: string; active?: boolean; deleted?: boolean } | string;
  currency_options?: Record<string, { unit_amount: number | null }>;
};

const price = (overrides: Partial<StripePrice> & { id: string }): StripePrice => ({
  unit_amount: 500,
  currency: 'eur',
  recurring: { interval: 'month' },
  product: { id: 'prod_default', active: true },
  ...overrides,
});

const makeClient = (tierRows: unknown[]): SupabaseClient =>
  ({
    from: () => ({
      select: () => Promise.resolve({ data: tierRows }),
    }),
  }) as unknown as SupabaseClient;

const activeTierRows = [
  {
    stripe_product_id: 'prod_active',
    profile_badges: { premium_tier: 1, display_name: 'Starter' },
  },
  {
    stripe_product_id: 'prod_archived',
    profile_badges: { premium_tier: 2, display_name: 'Legacy' },
  },
];

describe('StripeServiceServer.getPrices', () => {
  beforeEach(() => {
    mockPricesList.mockReset();
    mockGetSecret.mockResolvedValue('sk_test_123');
  });

  it('excludes prices whose parent product is archived (active: false)', async () => {
    mockPricesList.mockImplementation(({ product }: { product: string }) => {
      if (product === 'prod_active') {
        return Promise.resolve({
          data: [price({ id: 'price_active', product: { id: 'prod_active', active: true } })],
        });
      }
      // Stripe leaves prices active even after the product is archived.
      return Promise.resolve({
        data: [price({ id: 'price_archived', product: { id: 'prod_archived', active: false } })],
      });
    });

    const service = new StripeServiceServer(makeClient(activeTierRows));
    const result = await service.getPrices();

    const ids = result.map((p) => p.id);
    expect(ids).toContain('price_active');
    expect(ids).not.toContain('price_archived');
  });

  it('excludes prices whose parent product has been deleted', async () => {
    mockPricesList.mockResolvedValue({
      data: [price({ id: 'price_deleted', product: { id: 'prod_archived', deleted: true } })],
    });

    const service = new StripeServiceServer(
      makeClient([activeTierRows[1]]),
    );
    const result = await service.getPrices();

    expect(result.map((p) => p.id)).not.toContain('price_deleted');
  });

  it('keeps prices for active products', async () => {
    mockPricesList.mockResolvedValue({
      data: [price({ id: 'price_active', product: { id: 'prod_active', active: true } })],
    });

    const service = new StripeServiceServer(makeClient([activeTierRows[0]]));
    const result = await service.getPrices();

    expect(result.map((p) => p.id)).toEqual(['price_active']);
  });
});

// getStripe() caches its Stripe instance at module scope, so re-import a fresh module
// per test to keep the "not configured" case from reusing a previously built client.
async function loadService() {
  vi.resetModules();
  return (await import('src/services/stripeService.server')).StripeServiceServer;
}

describe('cancelActiveSubscriptions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSecret.mockResolvedValue('sk_test_123');
  });

  it('cancels every subscription returned for the customer and returns the count', async () => {
    mockList.mockResolvedValueOnce({ data: [{ id: 'sub_1' }, { id: 'sub_2' }] });
    mockCancel.mockResolvedValue({});

    const StripeServiceServer = await loadService();
    const cancelled = await StripeServiceServer.cancelActiveSubscriptions('cus_1');

    expect(mockList).toHaveBeenCalledWith({ customer: 'cus_1', limit: 100 });
    expect(mockCancel).toHaveBeenCalledTimes(2);
    expect(mockCancel).toHaveBeenCalledWith('sub_1');
    expect(mockCancel).toHaveBeenCalledWith('sub_2');
    expect(cancelled).toBe(2);
  });

  it('continues past a failing cancel and counts only the successes', async () => {
    mockList.mockResolvedValueOnce({ data: [{ id: 'sub_1' }, { id: 'sub_2' }] });
    mockCancel
      .mockRejectedValueOnce(new Error('stripe boom'))
      .mockResolvedValueOnce({});

    const StripeServiceServer = await loadService();
    const cancelled = await StripeServiceServer.cancelActiveSubscriptions('cus_1');

    expect(mockCancel).toHaveBeenCalledTimes(2);
    expect(cancelled).toBe(1);
    expect(mockLoggerError).toHaveBeenCalled();
  });

  it('returns 0 without listing when the customer has no subscriptions', async () => {
    mockList.mockResolvedValueOnce({ data: [] });

    const StripeServiceServer = await loadService();
    const cancelled = await StripeServiceServer.cancelActiveSubscriptions('cus_1');

    expect(mockList).toHaveBeenCalledWith({ customer: 'cus_1', limit: 100 });
    expect(mockCancel).not.toHaveBeenCalled();
    expect(cancelled).toBe(0);
  });

  it('returns 0 and does nothing when Stripe is not configured', async () => {
    mockGetSecret.mockRejectedValue(new Error('no key'));

    const StripeServiceServer = await loadService();
    const cancelled = await StripeServiceServer.cancelActiveSubscriptions('cus_1');

    expect(mockList).not.toHaveBeenCalled();
    expect(mockCancel).not.toHaveBeenCalled();
    expect(cancelled).toBe(0);
  });
});

describe('createCustomer', () => {
  const makeInsertClient = () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    return {
      client: { from: vi.fn(() => ({ insert })) } as unknown as SupabaseClient,
      insert,
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSecret.mockResolvedValue('sk_test_123');
  });

  it('reuses an existing Stripe customer with the same email and links it', async () => {
    mockCustomersList.mockResolvedValueOnce({ data: [{ id: 'cus_existing' }] });
    mockCustomersUpdate.mockResolvedValueOnce({ id: 'cus_existing' });
    const { client, insert } = makeInsertClient();

    const StripeServiceServer = await loadService();
    const id = await new StripeServiceServer(client).createCustomer(
      'auth_1',
      'a@b.com',
      'tenant_1',
    );

    expect(id).toBe('cus_existing');
    expect(mockCustomersCreate).not.toHaveBeenCalled();
    expect(mockCustomersUpdate).toHaveBeenCalledWith('cus_existing', {
      metadata: { supabase_user_id: 'auth_1', tenant_id: 'tenant_1' },
    });
    expect(insert).toHaveBeenCalledWith({
      auth_id: 'auth_1',
      stripe_customer_id: 'cus_existing',
      tenant_id: 'tenant_1',
    });
  });

  it('creates a new Stripe customer when none matches the email', async () => {
    mockCustomersList.mockResolvedValueOnce({ data: [] });
    mockCustomersCreate.mockResolvedValueOnce({ id: 'cus_new' });
    const { client, insert } = makeInsertClient();

    const StripeServiceServer = await loadService();
    const id = await new StripeServiceServer(client).createCustomer(
      'auth_1',
      'a@b.com',
      'tenant_1',
    );

    expect(id).toBe('cus_new');
    expect(mockCustomersUpdate).not.toHaveBeenCalled();
    expect(mockCustomersCreate).toHaveBeenCalledWith({
      email: 'a@b.com',
      metadata: { supabase_user_id: 'auth_1', tenant_id: 'tenant_1' },
    });
    expect(insert).toHaveBeenCalledWith({
      auth_id: 'auth_1',
      stripe_customer_id: 'cus_new',
      tenant_id: 'tenant_1',
    });
  });
});

describe('cancelIncompleteSubscriptions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSecret.mockResolvedValue('sk_test_123');
  });

  it('only lists incomplete subscriptions and cancels each one', async () => {
    mockList.mockResolvedValueOnce({ data: [{ id: 'sub_1' }, { id: 'sub_2' }] });
    mockCancel.mockResolvedValue({});

    const StripeServiceServer = await loadService();
    const cancelled = await StripeServiceServer.cancelIncompleteSubscriptions('cus_1');

    expect(mockList).toHaveBeenCalledWith({
      customer: 'cus_1',
      status: 'incomplete',
      limit: 100,
    });
    expect(mockCancel).toHaveBeenCalledTimes(2);
    expect(cancelled).toBe(2);
  });

  it('continues past a failing cancel and counts only the successes', async () => {
    mockList.mockResolvedValueOnce({ data: [{ id: 'sub_1' }, { id: 'sub_2' }] });
    mockCancel.mockRejectedValueOnce(new Error('stripe boom')).mockResolvedValueOnce({});

    const StripeServiceServer = await loadService();
    const cancelled = await StripeServiceServer.cancelIncompleteSubscriptions('cus_1');

    expect(cancelled).toBe(1);
    expect(mockLoggerError).toHaveBeenCalled();
  });

  it('returns 0 and does nothing when Stripe is not configured', async () => {
    mockGetSecret.mockRejectedValue(new Error('no key'));

    const StripeServiceServer = await loadService();
    const cancelled = await StripeServiceServer.cancelIncompleteSubscriptions('cus_1');

    expect(mockList).not.toHaveBeenCalled();
    expect(mockCancel).not.toHaveBeenCalled();
    expect(cancelled).toBe(0);
  });
});

describe('createSubscriptionWithPaymentIntent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSecret.mockResolvedValue('sk_test_123');
    mockCreate.mockResolvedValue({ id: 'sub_1', latest_invoice: { id: 'in_1' } });
    mockInvoicePaymentsList.mockResolvedValue({
      data: [{ payment: { payment_intent: { client_secret: 'pi_secret_123' } } }],
    });
  });

  it('saves the default payment method so renewals can be charged off-session', async () => {
    const StripeServiceServer = await loadService();
    await StripeServiceServer.createSubscriptionWithPaymentIntent('cus_1', 'price_1', 'eur');

    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        customer: 'cus_1',
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
      }),
    );
  });

  it('returns the payment intent client secret for the first invoice', async () => {
    const StripeServiceServer = await loadService();
    const clientSecret = await StripeServiceServer.createSubscriptionWithPaymentIntent(
      'cus_1',
      'price_1',
      'eur',
    );

    expect(clientSecret).toBe('pi_secret_123');
  });

  it('throws when no payment intent client secret is available', async () => {
    mockInvoicePaymentsList.mockResolvedValueOnce({ data: [] });

    const StripeServiceServer = await loadService();
    await expect(
      StripeServiceServer.createSubscriptionWithPaymentIntent('cus_1', 'price_1', 'eur'),
    ).rejects.toThrow('Failed to get payment intent client secret');
  });
});
