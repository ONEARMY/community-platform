import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@theme-ui/core';
import { theme } from 'oa-themes';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { SubscriptionStoreProvider } from 'src/stores/Subscription/subscription.store';
import { FactoryResearchItem } from 'src/test/factories/ResearchItem';
import { FactoryUser } from 'src/test/factories/User';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ResearchListItem from './ResearchListItem';

const mockUseProfileStore = vi.hoisted(() => vi.fn());
const mockIsSubscribed = vi.hoisted(() => vi.fn());

vi.mock('src/stores/Profile/profile.store', () => ({
  useProfileStore: mockUseProfileStore,
}));

vi.mock('src/services/subscribersService', () => ({
  subscribersService: { isSubscribed: mockIsSubscribed },
}));

const renderItem = () => {
  const item = FactoryResearchItem();
  const router = createMemoryRouter([{ path: '/research', element: <ResearchListItem item={item} /> }], {
    initialEntries: ['/research'],
  });

  return render(
    <ThemeProvider theme={theme}>
      <SubscriptionStoreProvider>
        <RouterProvider router={router} />
      </SubscriptionStoreProvider>
    </ThemeProvider>,
  );
};

describe('ResearchListItem follow icon', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockIsSubscribed.mockResolvedValue(true);
  });

  it('does not show the follow icon or check subscriptions when logged out', () => {
    mockUseProfileStore.mockReturnValue({ profile: undefined });

    const { container } = renderItem();

    expect(container.querySelector('[data-cy="ResearchListItem"]')).toBeInTheDocument();
    expect(screen.queryByTestId('follow-icon')).not.toBeInTheDocument();
    expect(mockIsSubscribed).not.toHaveBeenCalled();
  });

  it('shows the follow icon when a logged in user follows the item', async () => {
    mockUseProfileStore.mockReturnValue({ profile: FactoryUser() });

    renderItem();

    await waitFor(() => expect(screen.getByTestId('follow-icon')).toBeInTheDocument());
  });
});
