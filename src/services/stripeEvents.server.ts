import type Stripe from 'stripe';

export type SubscriptionChanges = {
  cancel_at?: number | null;
  status?: Stripe.Subscription.Status;
  items?: { data?: Array<{ price?: { product?: string } }> };
};

type CancellableSubscription = Pick<Stripe.Subscription, 'cancel_at'>;

// Scheduling a cancellation sets cancel_at
export const cancellationJustScheduled = (
  subscription: CancellableSubscription,
  changes: SubscriptionChanges | undefined,
) => subscription.cancel_at !== null && !!changes && 'cancel_at' in changes && !changes.cancel_at;

export const cancellationReversed = (
  subscription: CancellableSubscription,
  changes: SubscriptionChanges | undefined,
) => subscription.cancel_at === null && !!changes?.cancel_at;

const NEVER_PAID_STATUSES: Stripe.Subscription.Status[] = ['incomplete', 'incomplete_expired'];

// An abandoned checkout leaves an unpaid subscription that Stripe later deletes
// should not be announced as a cancellation
export const deletionIsWorthAnnouncing = (
  subscription: Pick<Stripe.Subscription, 'cancel_at' | 'status'>,
  changes: SubscriptionChanges | undefined,
) => {
  const statusBefore = changes?.status ?? subscription.status;

  return !subscription.cancel_at && !NEVER_PAID_STATUSES.includes(statusBefore);
};

export const tierChange = (
  subscription: Stripe.Subscription,
  changes: SubscriptionChanges | undefined,
): { from: string; to: string } | null => {
  const from = changes?.items?.data?.[0]?.price?.product;
  const to = subscription.items.data[0]?.price?.product as string | undefined;

  return from && to && from !== to ? { from, to } : null;
};

export const stripeCustomerUrl = (customerId: string, livemode: boolean) =>
  `https://dashboard.stripe.com/${livemode ? '' : 'test/'}customers/${customerId}`;

export const priceIdOf = (line: Stripe.InvoiceLineItem | undefined): string | undefined => {
  const price = line?.pricing?.price_details?.price;

  return typeof price === 'string' ? price : price?.id;
};
