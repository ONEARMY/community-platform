import '@testing-library/jest-dom/vitest';
import { createMemoryRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router';
import { act, render, waitFor, within } from '@testing-library/react';
import { ThemeProvider } from '@theme-ui/core';
import { Provider } from 'mobx-react';
import type { News } from 'oa-shared';
import { UserRole } from 'oa-shared';
import { FactoryNewsItem } from 'src/test/factories/News';
import { FactoryUser } from 'src/test/factories/User';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { NewsCta } from './NewsMemberCta';
import { NewsPage } from './NewsPage';
import { theme } from 'oa-themes';
import { FactoryPollData, FactoryPollOption } from "../../test/factories/Poll";

const activeUser = FactoryUser({
  roles: [UserRole.BETA_TESTER],
});

const mockNewsItem = FactoryNewsItem({
  slug: 'testSlug',
});

vi.mock('src/stores/Profile/profile.store', () => ({
  useProfileStore: () => ({
    profile: FactoryUser(),
    isUserAuthorized: vi.fn(() => false),
  }),
  ProfileStoreProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('src/stores/Subscription/subscription.store', () => ({
  useSubscriptionStore: vi.fn(() => ({
    isSubscribed: vi.fn(() => false),
    isLoading: vi.fn(() => false),
    checkAndCacheSubscription: vi.fn(),
    subscribe: vi.fn(),
    unsubscribe: vi.fn(),
    toggleSubscription: vi.fn(),
  })),
  SubscriptionStoreProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('src/stores/UsefulVote/usefulVote.store', () => ({
  useUsefulVoteStore: vi.fn(() => ({
    getVoteState: vi.fn(() => ({ hasVoted: false, usefulCount: 0, isLoading: false })),
    hasVoted: vi.fn(() => false),
    getUsefulCount: vi.fn(() => 0),
    isLoading: vi.fn(() => false),
    initializeVote: vi.fn(),
    toggleVote: vi.fn(),
    clearCache: vi.fn(),
  })),
  UsefulVoteStoreProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('News', () => {
  afterEach(() => {
    // Clear all mocks after each test to ensure there's no leakage between tests
    vi.clearAllMocks();
  });

  describe('Breadcrumbs', () => {
    it('displays breadcrumbs without category', async () => {
      // Arrange
      mockNewsItem.title = 'Do you prefer camping near a lake or in a forest?';
      mockNewsItem.category = null;

      // Act
      let wrapper;
      act(() => {
        wrapper = getWrapper(mockNewsItem);
      });

      // Assert: Check the breadcrumb items and chevrons
      await waitFor(() => {
        const breadcrumbItems = wrapper.getAllByTestId('breadcrumbsItem');
        expect(breadcrumbItems).toHaveLength(2);
        expect(breadcrumbItems[0]).toHaveTextContent('News');
        expect(breadcrumbItems[1]).toHaveTextContent('Do you prefer camping near a lake or in a forest?');

        // Assert: Check that the first breadcrumb item contains a link
        const firstLink = within(breadcrumbItems[0]).getByRole('link');
        expect(firstLink).toBeInTheDocument();

        // Assert: Check for the correct number of chevrons
        const chevrons = wrapper.getAllByTestId('breadcrumbsChevron');
        expect(chevrons).toHaveLength(1);
      });
    });
  });

  describe('Polls', () => {
    it('displays poll when present', async () => {
      // Arrange
      mockNewsItem.poll = FactoryPollData("Which is best?");
      mockNewsItem.poll.options = [
        FactoryPollOption(),
        FactoryPollOption(),
        FactoryPollOption(),
      ]

      // Act
      let wrapper;
      act(() => {
        wrapper = getWrapper(mockNewsItem);
      });

      // Assert
      await waitFor(() => {
        const pollDisplay = wrapper.getAllByTestId('pollDisplay');
        expect(pollDisplay).toHaveLength(1);
        expect(pollDisplay[0]).toHaveTextContent('Which is best?');
        const pollOptions = wrapper.getAllByTestId('pollOption');
        expect(pollOptions).toHaveLength(3);
      });
    });
  });

  describe('Locked', () => {
    it('names the badge that unlocks the news when it is one of its badges', async () => {
      const news = FactoryNewsItem({
        isLocked: true,
        ctaBadgeId: 3,
        profileBadges: [
          { id: 3, name: 'pro', displayName: 'PRO', imageUrl: 'https://example.com/pro.png' },
        ],
        poll: null,
        heroImage: { id: 'hero', publicUrl: 'https://example.com/hero.jpg' },
      });

      let wrapper;
      act(() => {
        wrapper = getWrapper(news);
      });

      await waitFor(() => {
        expect(wrapper.getByTestId('news-title')).toBeInTheDocument();
      });

      const image = (wrapper.container as HTMLElement).querySelector(
        '[data-cy="news-locked-image"]',
      );
      expect(image).toHaveTextContent('Just for PRO');
    });

    it('shows the summary, blurred image and call to action instead of the body', async () => {
      const news = FactoryNewsItem({
        isLocked: true,
        summary: 'A short preview',
        bodyHtml: '',
        poll: null,
        heroImage: { id: 'hero', publicUrl: 'https://example.com/hero.jpg' },
      });
      const cta = {
        title: 'Join us',
        body: 'Members read everything',
        imageUrl: 'https://example.com/icon.png',
        actionLabel: 'Become a member',
        actionUrl: '/support',
      };

      let wrapper;
      act(() => {
        wrapper = getWrapper(news, cta);
      });

      await waitFor(() => {
        expect(wrapper.getByTestId('news-title')).toBeInTheDocument();
      });

      const container = wrapper.container as HTMLElement;
      expect(container.querySelector('[data-cy="news-preview"]')).toHaveTextContent('A short preview');
      expect(container.querySelector('[data-cy="news-body"]')).toBeNull();
      expect(container.querySelector('[data-cy="news-locked-image"]')).toHaveTextContent(
        'Just for members',
      );

      const banner = container.querySelector('[data-cy="news-member-cta"]') as HTMLElement;
      expect(banner).toHaveTextContent('Join us');
      expect(banner).toHaveTextContent('Members read everything');
      expect(banner.querySelector('img')).toHaveAttribute('src', 'https://example.com/icon.png');
      expect(within(banner).getByRole('link', { name: 'Become a member' })).toHaveAttribute(
        'href',
        '/support',
      );
    });
  });
});

const getWrapper = (news: News, cta: NewsCta | null = null) => {
  const router = createMemoryRouter(createRoutesFromElements(<Route path="/news/:slug" key={1} element={<NewsPage news={news} cta={cta} />} />), {
    initialEntries: ['/news/news'],
  });

  return render(
    <Provider
      profileStore={{
        user: activeUser,
      }}
    >
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>,
  );
};
