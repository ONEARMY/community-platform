import { UpgradeBadge } from 'oa-shared';
import { factoryImage, FactoryUser } from 'src/test/factories/User';
import { describe, expect, it } from 'vitest';

import { ProfileStore } from './profile.store';

import type { Profile, ProfileType } from 'oa-shared';

describe('ProfileStore', () => {
  const { isProfileComplete, getMissingFields } = new ProfileStore();
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
          premium_tier: 1,
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

  describe('isProfileComplete', () => {
    describe('member', () => {
      it('returns true for a completed profile', () => {
        const completeProfile: Partial<Profile> = {
          about: 'A member',
          displayName: 'Jeffo',
          type: { id: 1, name: 'member' } as ProfileType,
          photo: factoryImage,
        };
        const user = FactoryUser(completeProfile);

        expect(isProfileComplete(user)).toBe(true);
      });

      describe('returns false if any core field is missing', () => {
        it('no about', () => {
          const missingAbout: Partial<Profile> = {
            displayName: 'Jeffo',
            type: { id: 1, name: 'member' } as ProfileType,
            photo: factoryImage,
          };
          const user = FactoryUser(missingAbout);

          expect(isProfileComplete(user)).toBe(false);
        });
        it('no displayName', () => {
          const missingDisplayName: Partial<Profile> = {
            about: 'A member',
            displayName: undefined,
            type: { id: 1, name: 'member' } as ProfileType,
            photo: factoryImage,
          };
          const user = FactoryUser(missingDisplayName);

          expect(isProfileComplete(user)).toBe(false);
        });
        it('no userImage', () => {
          const missingUserImage: Partial<Profile> = {
            about: 'A member',
            displayName: 'Jeffo',
            type: { id: 1, name: 'member' } as ProfileType,
            photo: undefined,
          };
          const user = FactoryUser(missingUserImage);

          expect(isProfileComplete(user)).toBe(false);
        });
      });
    });

    describe('space', () => {
      it('returns true for a completed profile', () => {
        const completeProfile: Partial<Profile> = {
          about: 'An important space',
          displayName: 'Jeffo',
          type: { id: 1, name: 'community-builder' } as ProfileType,
          coverImages: [factoryImage],
        };
        const user = FactoryUser(completeProfile);

        expect(isProfileComplete(user)).toBe(true);
      });

      describe('returns false if any core field is missing', () => {
        it('no about', () => {
          const missingAbout: Partial<Profile> = {
            displayName: 'Jeffo',
            type: { id: 1, name: 'community-builder' } as ProfileType,
            coverImages: [factoryImage],
          };
          const user = FactoryUser(missingAbout);

          expect(isProfileComplete(user)).toBe(false);
        });
        it('no displayName', () => {
          const missingDisplayName: Partial<Profile> = {
            about: 'An important space',
            displayName: undefined,
            type: { id: 1, name: 'community-builder' } as ProfileType,
            coverImages: [factoryImage],
          };
          const user = FactoryUser(missingDisplayName);

          expect(isProfileComplete(user)).toBe(false);
        });
        it('no userImage', () => {
          const missingUserImage: Partial<Profile> = {
            about: 'An important space',
            displayName: 'Jeffo',
            type: { id: 1, name: 'community-builder' } as ProfileType,
            coverImages: [],
          };
          const user = FactoryUser(missingUserImage);

          expect(isProfileComplete(user)).toBe(false);
        });
      });
    });
    it('returns false if profile type missing', () => {
      const missingProfileType: Partial<Profile> = {
        about: 'An unknown...',
        displayName: 'Jeffo',
        type: undefined,
        photo: factoryImage,
      };
      const user = FactoryUser(missingProfileType);

      expect(isProfileComplete(user)).toBe(false);
    });
  });

  describe('getMissingProfileFields', () => {
    describe('member', () => {
      it('returns empty array for complete profile', () => {
        const completeProfile: Partial<Profile> = {
          about: 'A member',
          displayName: 'Jeffo',
          type: { id: 1, name: 'member' } as ProfileType,
          photo: factoryImage,
        };
        const user = FactoryUser(completeProfile);

        expect(getMissingFields(user)).toEqual([]);
      });

      it('returns missing fields for incomplete profile', () => {
        const incompleteProfile: Partial<Profile> = {
          displayName: undefined,
          about: undefined,
          type: { id: 1, name: 'member' } as ProfileType,
          photo: undefined,
        };
        const user = FactoryUser(incompleteProfile);

        const missing = getMissingFields(user);
        expect(missing).toContain('Display name');
        expect(missing).toContain('About');
        expect(missing).toContain('Profile photo');
      });

      it('returns only missing about', () => {
        const profile: Partial<Profile> = {
          displayName: 'Jeffo',
          about: undefined,
          type: { id: 1, name: 'member' } as ProfileType,
          photo: factoryImage,
        };
        const user = FactoryUser(profile);

        expect(getMissingFields(user)).toEqual(['About']);
      });
    });

    describe('space', () => {
      it('returns empty array for complete profile', () => {
        const completeProfile: Partial<Profile> = {
          about: 'An important space',
          displayName: 'Jeffo',
          type: { id: 1, name: 'community-builder' } as ProfileType,
          coverImages: [factoryImage],
        };
        const user = FactoryUser(completeProfile);

        expect(getMissingFields(user)).toEqual([]);
      });

      it('returns missing fields for incomplete profile', () => {
        const incompleteProfile: Partial<Profile> = {
          displayName: undefined,
          about: undefined,
          type: { id: 1, name: 'community-builder' } as ProfileType,
          coverImages: [],
        };
        const user = FactoryUser(incompleteProfile);

        const missing = getMissingFields(user);
        expect(missing).toContain('Display name');
        expect(missing).toContain('About');
        expect(missing).toContain('Cover image');
      });

      it('returns only missing cover image', () => {
        const profile: Partial<Profile> = {
          about: 'An important space',
          displayName: 'Jeffo',
          type: { id: 1, name: 'community-builder' } as ProfileType,
          coverImages: [],
        };
        const user = FactoryUser(profile);

        expect(getMissingFields(user)).toEqual(['Cover image']);
      });
    });
  });
});
