import { render } from '@testing-library/react';
import { ProfileStoreProvider } from 'src/stores/Profile/profile.store';
import { FactoryUser } from 'src/test/factories/User';
import { describe, expect, it, vi } from 'vitest';

import { PremiumTierWrapper } from './PremiumTierWrapper';

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
        <PremiumTierWrapper tierRequired={2} fallback={<div>Fallback Content</div>}>
          <div>Test Content</div>
        </PremiumTierWrapper>
      </ProfileStoreProvider>,
    );
    expect(getByText('Fallback Content')).toBeTruthy();
  });

  it('renders child components when user has required tier', () => {
    const { getByText } = render(
      <ProfileStoreProvider>
        <PremiumTierWrapper tierRequired={1}>
          <div>Test Content</div>
        </PremiumTierWrapper>
      </ProfileStoreProvider>,
    );
    expect(getByText('Test Content')).toBeTruthy();
  });

  it('renders child components when tierRequired is 0', () => {
    const { getByText } = render(
      <ProfileStoreProvider>
        <PremiumTierWrapper tierRequired={0}>
          <div>Test Content</div>
        </PremiumTierWrapper>
      </ProfileStoreProvider>,
    );
    expect(getByText('Test Content')).toBeTruthy();
  });
});
