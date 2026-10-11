import '@testing-library/jest-dom/vitest';
import { render, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@theme-ui/core';
import { theme } from 'oa-themes';
import { MemoryRouter } from 'react-router';
import { notificationSupabaseService } from 'src/services/notificationsSupabaseService';
import { FactoryUser } from 'src/test/factories/User';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Header from './Header';

const mockUseProfileStore = vi.hoisted(() => vi.fn());

vi.mock('src/stores/Profile/profile.store', () => ({ useProfileStore: mockUseProfileStore }));
vi.mock('src/services/notificationsSupabaseService', () => ({
  notificationSupabaseService: { getNotifications: vi.fn().mockResolvedValue([]) },
}));
vi.mock('src/common/AuthWrapper', () => ({ AuthWrapper: () => null }));
vi.mock('src/pages/common/Header/Menu/Logo/Logo', () => ({ default: () => null }));
vi.mock('src/pages/common/Header/Menu/MenuDesktop', () => ({ default: () => null }));
vi.mock('src/pages/common/Header/Menu/MobileBottomNav', () => ({ default: () => null }));
vi.mock('src/pages/common/Header/Menu/Profile/Profile', () => ({ default: () => null }));
vi.mock('./Menu/Notifications/Notifications', () => ({ NotificationsSupabase: () => null }));

const renderHeader = (profile?: ReturnType<typeof FactoryUser>) => {
  mockUseProfileStore.mockReturnValue({ profile });

  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    </ThemeProvider>,
  );
};

describe('Header', () => {
  beforeEach(() => vi.clearAllMocks());

  it('does not fetch notifications when logged out', async () => {
    renderHeader();

    await waitFor(() =>
      expect(notificationSupabaseService.getNotifications).not.toHaveBeenCalled(),
    );
  });

  it('fetches notifications when logged in', async () => {
    renderHeader(FactoryUser());

    await waitFor(() =>
      expect(notificationSupabaseService.getNotifications).toHaveBeenCalledTimes(1),
    );
  });
});
