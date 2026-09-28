import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from '@theme-ui/core';
import { theme } from 'oa-themes';
import type { Author } from 'oa-shared';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { FactoryResearchItem } from 'src/test/factories/ResearchItem';
import { describe, expect, it, vi } from 'vitest';
import ResearchEngagementSection from './ResearchEngagementSection';

vi.mock('src/stores/Profile/profile.store', () => ({
  useProfileStore: () => ({ profile: undefined }),
}));

vi.mock('src/stores/Subscription/subscription.store', () => ({
  useSubscriptionStore: () => ({
    isSubscribed: () => undefined,
    isLoading: () => false,
    checkAndCacheSubscription: vi.fn(),
    toggleSubscription: vi.fn(),
  }),
}));

vi.mock('src/stores/UsefulVote/usefulVote.store', () => ({
  useUsefulVoteStore: () => ({
    getVoteState: () => ({ hasVoted: false, usefulCount: 0, isLoading: false }),
    hasVoted: () => false,
    getUsefulCount: () => 0,
    isLoading: () => false,
    initializeVote: vi.fn(),
    toggleVote: vi.fn(),
  }),
}));

const renderSection = () => {
  const research = FactoryResearchItem({
    author: { id: 1, username: 'research-author' } as Author,
    collaborators: [],
  });
  const router = createMemoryRouter(
    [
      { path: '/research/:slug', element: <ResearchEngagementSection research={research} /> },
      { path: '/sign-in', element: <p>Sign in page</p> },
    ],
    { initialEntries: ['/research/qwerty'] },
  );

  render(
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>,
  );

  return router;
};

describe('ResearchEngagementSection follow button', () => {
  it('shows a sign-in redirect instead of the follow button when logged out', async () => {
    const router = renderSection();

    expect(screen.queryByTestId('follow-button')).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId('follow-redirect'));

    expect(router.state.location.pathname).toBe('/sign-in');
    expect(await screen.findByText('Sign in page')).toBeInTheDocument();
  });
});
