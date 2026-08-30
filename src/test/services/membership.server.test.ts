import { discordServiceServer } from 'src/services/discordService.server';
import {
  membershipNotifications,
  supporterName,
  supporterProfileUrl,
} from 'src/services/membership.server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('src/services/discordService.server');

const MEMBERSHIP_WEBHOOK = 'https://discord.com/api/webhooks/membership';

const membership = membershipNotifications('Precious Plastic');

const lastMessage = () => vi.mocked(discordServiceServer.postWebhookRequest).mock.calls[0][0];

describe('membershipNotifications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('DISCORD_MEMBERSHIP_WEBHOOK_URL', MEMBERSHIP_WEBHOOK);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('when the membership webhook is not configured', () => {
    it('does not post at all', () => {
      vi.stubEnv('DISCORD_MEMBERSHIP_WEBHOOK_URL', '');

      membership.newSupporter('Michael', 'Legend', '€10', null);

      expect(discordServiceServer.postWebhookRequest).not.toHaveBeenCalled();
    });

    it('does not fall back to the general activity webhook', () => {
      vi.stubEnv('DISCORD_MEMBERSHIP_WEBHOOK_URL', '');
      vi.stubEnv('DISCORD_WEBHOOK_URL', 'https://discord.com/api/webhooks/activity');

      membership.newSupporter('Michael', 'Legend', '€10', null);

      expect(discordServiceServer.postWebhookRequest).not.toHaveBeenCalled();
    });
  });

  describe('tenant labelling', () => {
    it('prefixes the message with the tenant label', () => {
      membership.subscriptionCancelled('Michael');

      expect(discordServiceServer.postWebhookRequest).toHaveBeenCalledWith(
        '[Precious Plastic] Michael canceled their support',
        MEMBERSHIP_WEBHOOK,
      );
    });

    it('uses whatever label it is given', () => {
      membershipNotifications('some-new-tenant').subscriptionCancelled('Michael');

      expect(lastMessage()).toBe('[some-new-tenant] Michael canceled their support');
    });
  });

  describe('newSupporter', () => {
    const profileUrl = 'https://community.preciousplastic.com/u/11';

    it('names the tier and the amount, and links to the profile', () => {
      membership.newSupporter('Michael', 'Legend', '€10', profileUrl);

      expect(lastMessage()).toBe(
        `[Precious Plastic] Michael is now a new Legend Supporter (€10)\n<${profileUrl}>`,
      );
    });

    it('omits the tier when it cannot be resolved', () => {
      membership.newSupporter('Michael', null, '€10', profileUrl);

      expect(lastMessage()).toBe(
        `[Precious Plastic] Michael is now a new Supporter (€10)\n<${profileUrl}>`,
      );
    });

    it('omits the link when the payment is not tied to a profile', () => {
      membership.newSupporter('Michael', 'Legend', '€10', null);

      expect(lastMessage()).toBe('[Precious Plastic] Michael is now a new Legend Supporter (€10)');
    });
  });

  describe('recurringPayment', () => {
    it('describes a monthly plan', () => {
      membership.recurringPayment('Michael', 'Legend', 'month', '€10');

      expect(lastMessage()).toBe(
        '[Precious Plastic] Michael paid their monthly Legend membership (€10)',
      );
    });

    it('describes a yearly plan', () => {
      membership.recurringPayment('Michael', 'Legend', 'year', '€100');

      expect(lastMessage()).toBe(
        '[Precious Plastic] Michael paid their yearly Legend membership (€100)',
      );
    });

    it('drops the unknown parts rather than guessing', () => {
      membership.recurringPayment('Michael', null, null, '€10');

      expect(lastMessage()).toBe('[Precious Plastic] Michael paid their membership (€10)');
    });
  });

  describe('paymentFailed', () => {
    const stripeUrl = 'https://dashboard.stripe.com/customers/cus_1';

    it('reports the failure and links to Stripe for contact details', () => {
      membership.paymentFailed('Michael', 'Legend', '€10', stripeUrl);

      expect(lastMessage()).toBe(
        `[Precious Plastic] Michael had a failed payment for their Legend membership (€10)\n<${stripeUrl}>`,
      );
    });

    it('does not include a decline reason', () => {
      membership.paymentFailed('Michael', 'Legend', '€10', stripeUrl);

      expect(lastMessage()).not.toMatch(/insufficient|declined|card_/i);
    });
  });

  describe('subscriptionResumed', () => {
    it('reports an un-cancelled subscription', () => {
      membership.subscriptionResumed('Michael');

      expect(lastMessage()).toBe(
        '[Precious Plastic] Michael changed their mind and resumed their support',
      );
    });
  });

  describe('tierChanged', () => {
    it('names both tiers', () => {
      membership.tierChanged('Michael', 'Legend', 'Hero');

      expect(lastMessage()).toBe(
        '[Precious Plastic] Michael changed their membership from Legend to Hero',
      );
    });
  });


  describe('supporterProfileUrl', () => {
    const siteUrl = 'https://community.preciousplastic.com';

    it('links by profile id so it works before a username is set', () => {
      expect(supporterProfileUrl(siteUrl, 11)).toBe('https://community.preciousplastic.com/u/11');
    });

    it('has no link when the supporter has no profile', () => {
      expect(supporterProfileUrl(siteUrl, null)).toBe(null);
    });
  });

  describe('supporterName', () => {
    const customer = { name: 'Michael', email: 'michael@example.com' };

    it('prefers the CP display name', () => {
      expect(supporterName(customer, { id: 11, displayName: 'Big Mike' })).toBe('Big Mike');
    });

    it('falls back to the Stripe customer name', () => {
      expect(supporterName(customer, { id: 11, displayName: null })).toBe('Michael');
      expect(supporterName(customer)).toBe('Michael');
    });

    it('reads the same before and after the account exists', () => {
      const beforeSignup = supporterName(customer);
      const afterSignup = supporterName(customer, { id: 11, displayName: 'Michael' });

      expect(beforeSignup).toBe(afterSignup);
    });

    it('falls back to the profile id rather than the email address', () => {
      expect(
        supporterName({ name: null, email: 'michael@example.com' }, { id: 11, displayName: null }),
      ).toBe('profile #11');
    });

    it('never prints an email address', () => {
      const blank = { id: 11, displayName: '  ' };
      expect(supporterName({ name: '   ', email: 'michael@example.com' }, blank)).not.toContain('@');
    });

    it('falls back to a placeholder when there is no profile at all', () => {
      expect(supporterName(null)).toBe('Someone');
      expect(supporterName({ name: null, email: null })).toBe('Someone');
    });
  });
});
