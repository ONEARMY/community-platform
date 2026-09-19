import { logger } from 'src/logger';
import { formatCurrency } from 'src/utils/currency';
import type Stripe from 'stripe';
import { membershipNotifications, supporterName, supporterProfileUrl } from './membership.server';
import {
  cancellationJustScheduled,
  cancellationReversed,
  deletionIsWorthAnnouncing,
  priceIdOf,
  type SubscriptionChanges,
  stripeCustomerUrl,
  tierChange,
} from './stripeEvents.server';
import { StripeServiceServer } from './stripeService.server';

const MESSAGE_LOCALE = 'en-GB';

const NOTIFIED_EVENTS = [
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.payment_succeeded',
  'invoice.payment_failed',
];

export async function notifyMembershipEvent(
  event: Stripe.Event,
  stripeService: StripeServiceServer,
  tenantId: string | undefined,
  siteUrl: string,
) {
  if (!tenantId || !NOTIFIED_EVENTS.includes(event.type)) {
    return;
  }

  const tierNameOf = (productId: string | undefined) =>
    productId ? stripeService.getTierNameForProduct(productId, tenantId) : null;

  const supporterFor = async (customerId: string) => {
    const customer = await StripeServiceServer.getStripeCustomer(customerId);
    const profile = await stripeService.getProfileIdentityByStripeCustomerId(
      customerId,
      tenantId,
      customer?.email ?? null,
    );

    return { name: supporterName(customer, profile), profileId: profile?.id ?? null };
  };

  const nameFor = async (customerId: string) => (await supporterFor(customerId)).name;

  try {
    const membership = membershipNotifications();

    switch (event.type) {
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const changes = event.data.previous_attributes as SubscriptionChanges | undefined;

        if (cancellationJustScheduled(subscription, changes)) {
          membership.subscriptionCancelled(await nameFor(subscription.customer as string));
          break;
        }

        if (cancellationReversed(subscription, changes)) {
          membership.subscriptionResumed(await nameFor(subscription.customer as string));
          break;
        }

        const change = tierChange(subscription, changes);

        if (!change) {
          break;
        }

        const [name, fromTierName, toTierName] = await Promise.all([
          nameFor(subscription.customer as string),
          tierNameOf(change.from),
          tierNameOf(change.to),
        ]);

        if (fromTierName && toTierName) {
          membership.tierChanged(name, fromTierName, toTierName);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const changes = event.data.previous_attributes as SubscriptionChanges | undefined;
        if (!deletionIsWorthAnnouncing(subscription, changes)) {
          break;
        }

        membership.subscriptionCancelled(await nameFor(subscription.customer as string));
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        const billingReason = invoice.billing_reason;

        if (billingReason !== 'subscription_create' && billingReason !== 'subscription_cycle') {
          break;
        }

        const customerId = invoice.customer as string;
        const line = invoice.lines.data[0];
        const priceId = priceIdOf(line);

        const [supporter, tierName, interval] = await Promise.all([
          supporterFor(customerId),
          tierNameOf(line?.pricing?.price_details?.product),
          priceId ? StripeServiceServer.getPriceInterval(priceId) : null,
        ]);

        const amount = formatCurrency(invoice.amount_paid, invoice.currency, MESSAGE_LOCALE);

        if (billingReason === 'subscription_create') {
          // A supporter who signs up as a guest has no profile until they set a password on the
          // thank you page, which is usually after this fires. Point at Stripe until they do.
          membership.newSupporter(
            supporter.name,
            tierName,
            amount,
            supporterProfileUrl(siteUrl, supporter.profileId) ??
              stripeCustomerUrl(customerId, event.livemode),
          );
        } else {
          membership.recurringPayment(supporter.name, tierName, interval, amount);
        }
        break;
      }

      // Renewals only. A decline at signup fires this too, but the supporter is still on the
      // page and will usually just retry, so there is nothing for the team to act on.
      case 'invoice.payment_failed': {
        const invoice = event.data.object;

        if (invoice.billing_reason !== 'subscription_cycle') {
          break;
        }

        const customerId = invoice.customer as string;
        const line = invoice.lines.data[0];

        const [name, tierName] = await Promise.all([
          nameFor(customerId),
          tierNameOf(line?.pricing?.price_details?.product),
        ]);

        membership.paymentFailed(
          name,
          tierName,
          formatCurrency(invoice.amount_due, invoice.currency, MESSAGE_LOCALE),
          stripeCustomerUrl(customerId, event.livemode),
        );
        break;
      }

      default:
        break;
    }
  } catch (error) {
    logger.error('Membership notification failed:', error);
  }
}
