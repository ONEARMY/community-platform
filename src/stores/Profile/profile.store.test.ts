import { UpgradeBadge } from 'oa-shared';
import { describe, expect, it } from 'vitest';

import { ProfileStore } from './profile.store';

describe('ProfileStore', () => {
  describe('upgradeBadgeForCurrentUser', () => {
    const createMockUpgradeBadge = (badgeId: number, isSpace: boolean, label: string) =>
      UpgradeBadge.fromDB({
        id: badgeId,
        tenant_id: 'test-tenant',
        badge_id: badgeId,
        is_space: isSpace,
        action_label: label,
        action_url: 'https://example.com',
        badge: {
          id: badgeId,
          name: 'pro',
          display_name: 'PRO',
          image_url: 'https://example.com/badge.png',
          action_url: 'https://example.com',
        },
      });

    it('returns undefined when profile is not set', () => {
      const store = new ProfileStore();
      store.upgradeBadges = [createMockUpgradeBadge(1, false, 'Go PRO')];

      expect(store.upgradeBadgeForCurrentUser).toBeUndefined();
    });

    it('returns undefined when upgradeBadges is not set', () => {
      const store = new ProfileStore();
      store.profile = { type: { isSpace: false }, badges: [] } as any;

      expect(store.upgradeBadgeForCurrentUser).toBeUndefined();
    });

    it('returns undefined when user already has the badge', () => {
      const store = new ProfileStore();
      store.profile = {
        type: { isSpace: false },
        badges: [{ id: 1 }],
      } as any;
      store.upgradeBadges = [createMockUpgradeBadge(1, false, 'Go PRO')];

      expect(store.upgradeBadgeForCurrentUser).toBeUndefined();
    });

    it('returns upgrade badge when workspace does not have the badge', () => {
      const store = new ProfileStore();
      store.profile = {
        type: { isSpace: true },
        badges: [],
      } as any;
      store.upgradeBadges = [createMockUpgradeBadge(1, true, 'Go PRO')];

      const result = store.upgradeBadgeForCurrentUser;
      expect(result).toBeDefined();
      expect(result?.actionLabel).toBe('Go PRO');
    });

    it('returns undefined for members when only workspace badge exists', () => {
      const store = new ProfileStore();
      store.profile = {
        type: { isSpace: false },
        badges: [],
      } as any;
      store.upgradeBadges = [createMockUpgradeBadge(1, true, 'Go PRO')];

      const result = store.upgradeBadgeForCurrentUser;
      expect(result).toBeUndefined(); // member doesn't see workspace badge
    });
  });
});
