import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@theme-ui/core';
import { ProfileBadge } from 'oa-shared';
import { theme } from 'oa-themes';
import { MemoryRouter } from 'react-router';
import { FactoryUser } from 'src/test/factories/User';
import { describe, expect, it, vi } from 'vitest';
import { ProfileModal } from './ProfileModal';

const mockUseProfileStore = vi.hoisted(() => vi.fn());

vi.mock('src/stores/Profile/profile.store', () => ({ useProfileStore: mockUseProfileStore }));
vi.mock('src/common/AuthWrapper', () => ({ AuthWrapper: () => null }));

const renderModal = (upgradeBadge?: ProfileBadge) => {
  mockUseProfileStore.mockReturnValue({
    profile: FactoryUser({ username: 'someone' }),
    upgradeBadgeForCurrentUser: upgradeBadge,
  });

  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <ProfileModal onClose={vi.fn()} />
      </MemoryRouter>
    </ThemeProvider>,
  );
};

describe('ProfileModal', () => {
  it('links to the badge offered to the current user', () => {
    renderModal(
      new ProfileBadge({
        id: 1,
        name: 'member',
        displayName: 'Member',
        actionUrl: '/support',
        actionLabel: 'Become a member',
      }),
    );

    expect(screen.getByText('Become a member').closest('a')).toHaveAttribute('href', '/support');
  });

  it('shows no offer when there is none', () => {
    renderModal();

    expect(screen.queryByText('Become a member')).not.toBeInTheDocument();
    expect(screen.getByText('Log out')).toBeInTheDocument();
  });
});
