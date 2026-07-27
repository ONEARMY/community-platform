import type { SupabaseClient } from '@supabase/supabase-js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockPricesList = vi.fn();

vi.mock('stripe', () => ({
  default: class {
    prices = { list: mockPricesList };
  },
}));

vi.mock('src/services/secretsService.server', () => ({
  getSecret: vi.fn().mockResolvedValue('sk_test_123'),
}));

vi.mock('src/repository/supabaseAdmin.server', () => ({
  createSupabaseAdminServerClient: vi.fn(),
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
