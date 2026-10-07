import { ProfileBadge } from 'oa-shared';
import { factoryImage, FactoryUser } from 'src/test/factories/User';
import { describe, expect, it } from 'vitest';

import { ProfileStore } from './profile.store';

import type { BadgeAvailability, Profile, ProfileType } from 'oa-shared';

describe('ProfileStore', () => {
  const { isProfileComplete, getMissingFields } = new ProfileStore();
  describe('upgradeBadgeForCurrentUser', () => {
    const createMockBadge = (
      id: number,
      opts: {
        availableTo?: BadgeAvailability;
        label?: string;
        grants?: number;
        premiumTier?: number;
      } = {},
    ) =>
      ProfileBadge.fromDB({
        id,
        name: `badge-${id}`,
        display_name: `Badge ${id}`,
        image_url: 'https://example.com/badge.png',
        action_url: 'https://example.com',
        premium_tier: opts.premiumTier ?? null,
        is_audience: true,
        grants_badge_id: opts.grants ?? null,
        available_to: opts.availableTo ?? null,
        action_label: opts.label ?? null,
      });

    it('returns undefined when profile is not set', () => {
      const store = new ProfileStore();
      store.profileBadges = [createMockBadge(1, { availableTo: 'non_space', label: 'Go PRO' })];

      expect(store.upgradeBadgeForCurrentUser).toBeUndefined();
    });

    it('returns undefined when profileBadges is not set', () => {
      const store = new ProfileStore();
      store.profile = { type: { isSpace: false }, badges: [] } as any;

      expect(store.upgradeBadgeForCurrentUser).toBeUndefined();
    });

    it('returns undefined when user already has the badge', () => {
      const store = new ProfileStore();
      store.profile = { type: { isSpace: false }, badges: [{ id: 1 }] } as any;
      store.profileBadges = [createMockBadge(1, { availableTo: 'non_space', label: 'Go PRO' })];

      expect(store.upgradeBadgeForCurrentUser).toBeUndefined();
    });

    it('returns the offered badge when a workspace does not have it', () => {
      const store = new ProfileStore();
      store.profile = { type: { isSpace: true }, badges: [] } as any;
      store.profileBadges = [createMockBadge(1, { availableTo: 'space', label: 'Go PRO' })];

      const result = store.upgradeBadgeForCurrentUser;
      expect(result?.id).toBe(1);
      expect(result?.actionLabel).toBe('Go PRO');
    });

    it('returns undefined for members when only a space badge is offered', () => {
      const store = new ProfileStore();
      store.profile = { type: { isSpace: false }, badges: [] } as any;
      store.profileBadges = [createMockBadge(1, { availableTo: 'space', label: 'Go PRO' })];

      expect(store.upgradeBadgeForCurrentUser).toBeUndefined();
    });

    it('ignores badges that are not offered', () => {
      const store = new ProfileStore();
      store.profile = { type: { isSpace: false }, badges: [] } as any;
      store.profileBadges = [createMockBadge(1)];

      expect(store.upgradeBadgeForCurrentUser).toBeUndefined();
    });

    it.each([
      { isSpace: true, expectedLabel: 'Go PRO' },
      { isSpace: false, expectedLabel: 'Become a member' },
    ])('returns the badge matching profile type (isSpace: $isSpace)', ({ isSpace, expectedLabel }) => {
      const store = new ProfileStore();
      store.profile = { type: { isSpace }, badges: [] } as any;
      store.profileBadges = [
        createMockBadge(1, { availableTo: 'space', label: 'Go PRO' }),
        createMockBadge(2, { availableTo: 'non_space', label: 'Become a member' }),
      ];

      expect(store.upgradeBadgeForCurrentUser?.actionLabel).toBe(expectedLabel);
    });

    it('treats a profile without a type as non-space', () => {
      const store = new ProfileStore();
      store.profile = { badges: [] } as any;
      store.profileBadges = [
        createMockBadge(1, { availableTo: 'space', label: 'Go PRO' }),
        createMockBadge(2, { availableTo: 'non_space', label: 'Become a member' }),
      ];

      expect(store.upgradeBadgeForCurrentUser?.id).toBe(2);
    });

    it.each([true, false])('offers badges available to all (isSpace: %s)', (isSpace) => {
      const store = new ProfileStore();
      store.profile = { type: { isSpace }, badges: [] } as any;
      store.profileBadges = [createMockBadge(1, { availableTo: 'all', label: 'Join' })];

      expect(store.upgradeBadgeForCurrentUser?.id).toBe(1);
    });

    it('returns undefined when a held badge grants the offered badge', () => {
      const store = new ProfileStore();
      store.profile = { type: { isSpace: false }, badges: [{ id: 3 }] } as any;
      store.profileBadges = [
        createMockBadge(1, { availableTo: 'non_space', label: 'Become a member' }),
        createMockBadge(3, { grants: 1 }),
      ];

      expect(store.upgradeBadgeForCurrentUser).toBeUndefined();
    });

    it('follows chained grants', () => {
      const store = new ProfileStore();
      store.profile = { type: { isSpace: false }, badges: [{ id: 4 }] } as any;
      store.profileBadges = [
        createMockBadge(1, { availableTo: 'non_space', label: 'Become a member' }),
        createMockBadge(3, { grants: 1 }),
        createMockBadge(4, { grants: 3 }),
      ];

      expect(store.upgradeBadgeForCurrentUser).toBeUndefined();
    });

    it('prefers the lowest premium tier, then the lowest id', () => {
      const store = new ProfileStore();
      store.profile = { type: { isSpace: false }, badges: [] } as any;
      store.profileBadges = [
        createMockBadge(5, { availableTo: 'non_space', label: 'No tier' }),
        createMockBadge(4, { availableTo: 'non_space', label: 'Tier 2', premiumTier: 2 }),
        createMockBadge(3, { availableTo: 'non_space', label: 'Tier 1 later', premiumTier: 1 }),
        createMockBadge(2, { availableTo: 'non_space', label: 'Tier 1', premiumTier: 1 }),
      ];

      expect(store.upgradeBadgeForCurrentUser?.actionLabel).toBe('Tier 1');
    });

    it('returns the next offer when the first one is already held', () => {
      const store = new ProfileStore();
      store.profile = { type: { isSpace: false }, badges: [{ id: 1 }] } as any;
      store.profileBadges = [
        createMockBadge(1, { availableTo: 'non_space', label: 'First', premiumTier: 1 }),
        createMockBadge(2, { availableTo: 'all', label: 'Second', premiumTier: 2 }),
      ];

      expect(store.upgradeBadgeForCurrentUser?.actionLabel).toBe('Second');
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
