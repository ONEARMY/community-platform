import {
  cancellationJustScheduled,
  cancellationReversed,
  deletionIsWorthAnnouncing,
  priceIdOf,
  stripeCustomerUrl,
  tierChange,
} from 'src/services/stripeEvents.server';
import { describe, expect, it } from 'vitest';

const CANCEL_AT = 1789952003;

const subscriptionOn = (productId: string) =>
  ({ items: { data: [{ price: { product: productId } }] } }) as never;

describe('cancellationJustScheduled', () => {
  it('detects the click that schedules a cancellation', () => {
    expect(cancellationJustScheduled({ cancel_at: CANCEL_AT }, { cancel_at: null })).toBe(true);
  });

  it('ignores an unrelated update to a subscription already cancelling', () => {
    expect(cancellationJustScheduled({ cancel_at: CANCEL_AT }, {})).toBe(false);
  });

  it('ignores a rescheduled cancellation date', () => {
    expect(
      cancellationJustScheduled({ cancel_at: CANCEL_AT }, { cancel_at: CANCEL_AT - 86400 }),
    ).toBe(false);
  });

  it('ignores a subscription that is not cancelling', () => {
    expect(cancellationJustScheduled({ cancel_at: null }, { cancel_at: null })).toBe(false);
  });

  it('does not rely on cancel_at_period_end, which stays false', () => {
    const subscription = { cancel_at: CANCEL_AT, cancel_at_period_end: false } as never;

    expect(cancellationJustScheduled(subscription, { cancel_at: null })).toBe(true);
  });
});

describe('cancellationReversed', () => {
  it('detects an un-cancelled subscription', () => {
    expect(cancellationReversed({ cancel_at: null }, { cancel_at: CANCEL_AT })).toBe(true);
  });

  it('ignores a subscription that was never cancelling', () => {
    expect(cancellationReversed({ cancel_at: null }, { cancel_at: null })).toBe(false);
    expect(cancellationReversed({ cancel_at: null }, {})).toBe(false);
  });

  it('ignores a subscription that is still cancelling', () => {
    expect(cancellationReversed({ cancel_at: CANCEL_AT }, { cancel_at: CANCEL_AT })).toBe(false);
  });
});

describe('deletionIsWorthAnnouncing', () => {
  it('announces a subscription deleted outright while active', () => {
    expect(deletionIsWorthAnnouncing({ cancel_at: null, status: 'active' }, undefined)).toBe(true);
  });

  it('stays quiet for an abandoned checkout that was never paid', () => {
    expect(deletionIsWorthAnnouncing({ cancel_at: null, status: 'incomplete' }, undefined)).toBe(
      false,
    );
    expect(
      deletionIsWorthAnnouncing({ cancel_at: null, status: 'incomplete_expired' }, undefined),
    ).toBe(false);
  });

  it('reads the status from before the deletion when Stripe reports one', () => {
    const subscription = { cancel_at: null, status: 'canceled' } as const;

    expect(deletionIsWorthAnnouncing(subscription, { status: 'incomplete' })).toBe(false);
    expect(deletionIsWorthAnnouncing(subscription, { status: 'active' })).toBe(true);
  });

  it('stays quiet for a scheduled cancellation, already announced at click time', () => {
    expect(deletionIsWorthAnnouncing({ cancel_at: CANCEL_AT, status: 'active' }, undefined)).toBe(
      false,
    );
  });
});

describe('tierChange', () => {
  it('reports the products either side of a switch', () => {
    const changes = { items: { data: [{ price: { product: 'prod_hero' } }] } };

    expect(tierChange(subscriptionOn('prod_legend'), changes)).toEqual({
      from: 'prod_hero',
      to: 'prod_legend',
    });
  });

  it('ignores an update that did not touch the product', () => {
    const changes = { items: { data: [{ price: { product: 'prod_hero' } }] } };

    expect(tierChange(subscriptionOn('prod_hero'), changes)).toBeNull();
  });

  it('returns null when Stripe omits the previous items', () => {
    expect(tierChange(subscriptionOn('prod_hero'), {})).toBeNull();
    expect(tierChange(subscriptionOn('prod_hero'), undefined)).toBeNull();
    expect(tierChange(subscriptionOn('prod_hero'), { items: { data: [] } })).toBeNull();
  });
});

describe('stripeCustomerUrl', () => {
  it('points at the live dashboard in livemode', () => {
    expect(stripeCustomerUrl('cus_1', true)).toBe('https://dashboard.stripe.com/customers/cus_1');
  });

  it('points at the test dashboard otherwise', () => {
    expect(stripeCustomerUrl('cus_1', false)).toBe(
      'https://dashboard.stripe.com/test/customers/cus_1',
    );
  });
});

describe('priceIdOf', () => {
  it('reads an expanded price object', () => {
    const line = { pricing: { price_details: { price: { id: 'price_1' } } } } as never;

    expect(priceIdOf(line)).toBe('price_1');
  });

  it('reads a price given as a bare id', () => {
    const line = { pricing: { price_details: { price: 'price_1' } } } as never;

    expect(priceIdOf(line)).toBe('price_1');
  });

  it('returns undefined when the line has no pricing', () => {
    expect(priceIdOf(undefined)).toBeUndefined();
    expect(priceIdOf({} as never)).toBeUndefined();
  });
});
