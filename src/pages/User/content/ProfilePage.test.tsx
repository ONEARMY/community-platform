import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/react';
import { UpgradeBadge } from 'oa-shared';
import { MemoryRouter } from 'react-router';
import { FactoryUser } from 'src/test/factories/User';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProfilePage } from './ProfilePage';

const mockUseProfileStore = vi.hoisted(() => vi.fn());

vi.mock('src/stores/Profile/profile.store', () => ({
  useProfileStore: mockUseProfileStore,
}));

vi.mock('src/common/Analytics', () => ({
  trackEvent: vi.fn(),
}));

vi.mock('./BanUserButton', () => ({
  BanUserButton: () => null,
}));

vi.mock('./UserProfile', () => ({
  UserProfile: () => null,
}));

const upgradeBadge = UpgradeBadge.fromDB({
  id: 1,
  tenant_id: 'test-tenant',
  badge_id: 1,
  is_space: true,
  action_label: 'Go PRO',
  action_url: 'https://example.com',
  badge: {
    id: 1,
    name: 'pro',
    display_name: 'PRO',
    image_url: 'https://example.com/badge.png',
    action_url: 'https://example.com',
    premium_tier: 1,
  },
});

const docs = { projects: [], research: [], questions: [] };

const renderPage = (profile: any) =>
  render(
    <MemoryRouter>
      <ProfilePage profile={profile} userCreatedDocs={docs as any} />
    </MemoryRouter>,
  );

describe('ProfilePage upgrade badge', () => {
  const activeUser = FactoryUser({ id: 1, username: 'workspace' });

  beforeEach(() => {
    mockUseProfileStore.mockReturnValue({
      profile: activeUser,
      upgradeBadgeForCurrentUser: upgradeBadge,
    });
  });

  it('shows the upgrade button on own profile', () => {
    renderPage(activeUser);

    const link = document.querySelector('[data-cy="UpgradeBadge"]');
    expect(link).toHaveTextContent('Go PRO');
  });

  it('hides the upgrade button on another profile', () => {
    renderPage(FactoryUser({ id: 2, username: 'other' }));

    expect(document.querySelector('[data-cy="UpgradeBadge"]')).not.toBeInTheDocument();
  });

  it('hides the upgrade button when there is no upgrade badge for the user', () => {
    mockUseProfileStore.mockReturnValue({
      profile: activeUser,
      upgradeBadgeForCurrentUser: undefined,
    });
    renderPage(activeUser);

    expect(document.querySelector('[data-cy="UpgradeBadge"]')).not.toBeInTheDocument();
  });
});
