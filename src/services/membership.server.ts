import { discordServiceServer } from './discordService.server';

export type BillingInterval = 'day' | 'week' | 'month' | 'year';

const INTERVAL_WORDS: Record<BillingInterval, string> = {
  day: 'daily',
  week: 'weekly',
  month: 'monthly',
  year: 'yearly',
};

type ProfileIdentity = { id: number; displayName: string | null };

export const supporterName = (
  customer: { name: string | null; email: string | null } | null,
  profile?: ProfileIdentity | null,
): string =>
  profile?.displayName?.trim() ||
  customer?.name?.trim() ||
  (profile ? `profile #${profile.id}` : 'Someone');

export const membershipNotifications = (tenantLabel: string) => {
  const post = (message: string) => {
    const webhookUrl = process.env.DISCORD_MEMBERSHIP_WEBHOOK_URL;

    if (!webhookUrl) {
      return;
    }

    discordServiceServer.postWebhookRequest(`[${tenantLabel}] ${message}`, webhookUrl);
  };

  return {
    newSupporter(name: string, tierName: string | null, amount: string) {
      const description = tierName ? `a new ${tierName} Supporter` : 'a new Supporter';

      post(`${name} is now ${description} (${amount})`);
    },

    recurringPayment(
      name: string,
      tierName: string | null,
      interval: BillingInterval | null,
      amount: string,
    ) {
      const description = [interval ? INTERVAL_WORDS[interval] : null, tierName, 'membership']
        .filter(Boolean)
        .join(' ');

      post(`${name} paid their ${description} (${amount})`);
    },

    paymentFailed(
      name: string,
      tierName: string | null,
      amount: string,
      stripeCustomerUrl: string,
    ) {
      const description = [tierName, 'membership'].filter(Boolean).join(' ');

      post(
        `${name} had a failed payment for their ${description} (${amount})\n<${stripeCustomerUrl}>`,
      );
    },

    supporterAccountReady(name: string, tierName: string | null, profileUrl: string) {
      const description = tierName ? `their ${tierName} account` : 'their account';

      post(`${name} set up ${description}: <${profileUrl}>`);
    },

    tierChanged(name: string, fromTierName: string, toTierName: string) {
      post(`${name} changed their membership from ${fromTierName} to ${toTierName}`);
    },

    subscriptionCancelled(name: string) {
      post(`${name} canceled their support`);
    },

    subscriptionResumed(name: string) {
      post(`${name} changed their mind and resumed their support`);
    },
  };
};
