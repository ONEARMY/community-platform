import { render } from '@testing-library/react';
import { PremiumTier, type Profile, UserRole } from 'oa-shared';
import { ProfileStoreProvider } from 'src/stores/Profile/profile.store';
import { FactoryUser } from 'src/test/factories/User';
import { describe, expect, it, vi } from 'vitest';

import { PremiumTierWrapper, userHasPremiumTier } from './PremiumTierWrapper';

vi.mock('src/stores/Profile/profile.store', () => ({
  useProfileStore: () => ({
    profile: FactoryUser({
      badges: [
        {
          id: 1,
          name: 'supporter',
          displayName: 'Supporter',
          imageUrl: 'https://example.com/icons/supporter.svg',
        },
        {
          id: 2,
          name: 'pro',
          displayName: 'PRO',
          imageUrl: 'https://example.com/icons/pro.svg',
          premiumTier: 1,
        },
      ],
    }),
  }),
  ProfileStoreProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('PremiumTierWrapper', () => {
  it('renders fallback when user does not have required tier', () => {
    const { getByText } = render(
      <ProfileStoreProvider>
        <PremiumTierWrapper tierRequired={2 as PremiumTier} fallback={<div>Fallback Content</div>}>
          <div>Test Content</div>
        </PremiumTierWrapper>
      </ProfileStoreProvider>,
    );
    expect(getByText('Fallback Content')).toBeTruthy();
  });

  it('renders child components when user has required tier', () => {
    const { getByText } = render(
      <ProfileStoreProvider>
        <PremiumTierWrapper tierRequired={PremiumTier.ONE}>
          <div>Test Content</div>
        </PremiumTierWrapper>
      </ProfileStoreProvider>,
    );
    expect(getByText('Test Content')).toBeTruthy();
  });
});

describe('userHasPremiumTier', () => {
  it('returns true for admin users regardless of tier', () => {
    const adminUser = FactoryUser({ roles: [UserRole.ADMIN], badges: [] }) as Profile;
    expect(userHasPremiumTier(adminUser, PremiumTier.ONE)).toBe(true);
  });

  it('returns false when user does not have required tier', () => {
    const user = FactoryUser({ badges: [] }) as Profile;
    expect(userHasPremiumTier(user, PremiumTier.ONE)).toBe(false);
  });

  it('returns true when no tier is required', () => {
    const user = FactoryUser({ badges: [] }) as Profile;
    expect(userHasPremiumTier(user, undefined)).toBe(true);
  });
});
