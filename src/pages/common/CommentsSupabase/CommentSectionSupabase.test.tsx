import '@testing-library/jest-dom/vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@theme-ui/core';
import type { Comment } from 'oa-shared';
import { theme } from 'oa-themes';
import { MemoryRouter } from 'react-router';
import { logger } from 'src/logger';
import { FactoryComment } from 'src/test/factories/Comment';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CommentSectionSupabase } from './CommentSectionSupabase';
import { CommentSortOption } from './CommentSortOptions';

const mockGetComments = vi.hoisted(() => vi.fn());

vi.mock('src/logger', () => ({ logger: { error: vi.fn() } }));

vi.mock('src/services/commentService', () => ({
  commentService: { getComments: mockGetComments },
}));

vi.mock('src/stores/Profile/profile.store', () => ({
  useProfileStore: () => ({ profile: undefined, isComplete: null }),
  ProfileStoreProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('src/stores/Subscription/useSubscription', () => ({
  useSubscription: () => ({ isSubscribed: false, toggle: vi.fn() }),
}));

vi.mock('./CommentItemSupabase', () => ({
  CommentItemSupabase: ({ comment }: { comment: Comment }) => (
    <div data-cy="comment-text">{comment.comment}</div>
  ),
}));

const buildComments = (count: number) =>
  Array.from({ length: count }, (_, i) =>
    FactoryComment({
      id: i + 1,
      comment: `comment ${i + 1}`,
      createdAt: new Date(2024, 0, i + 1),
      voteCount: i === 2 ? 5 : 0,
      deleted: false,
      replies: [],
    }),
  );

const renderSection = (defaultSortBy?: CommentSortOption) =>
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <CommentSectionSupabase
          authors={[]}
          sourceId={1}
          sourceType="questions"
          defaultSortBy={defaultSortBy}
        />
      </MemoryRouter>
    </ThemeProvider>,
  ).container;

const renderedComments = () => screen.getAllByText(/^comment \d$/).map((x) => x.textContent);

describe('CommentSectionSupabase', () => {
  beforeEach(() => {
    mockGetComments.mockReset();
  });

  it('hides the sort select with fewer than five comments', async () => {
    mockGetComments.mockResolvedValue(buildComments(4));

    const container = renderSection();

    await waitFor(() => expect(renderedComments()).toHaveLength(4));
    expect(container.querySelector('[data-cy=comment-sort-select]')).not.toBeInTheDocument();
  });

  it('shows the sort select with five comments', async () => {
    mockGetComments.mockResolvedValue(buildComments(5));

    const container = renderSection();

    await waitFor(() =>
      expect(container.querySelector('[data-cy=comment-sort-select]')).toBeInTheDocument(),
    );
    expect(screen.getByText('Oldest')).toBeInTheDocument();
    expect(renderedComments()).toEqual([
      'comment 1',
      'comment 2',
      'comment 3',
      'comment 4',
      'comment 5',
    ]);
  });

  it('applies the default sort', async () => {
    mockGetComments.mockResolvedValue(buildComments(5));

    renderSection(CommentSortOption.MostUseful);

    await waitFor(() => expect(renderedComments()).toHaveLength(5));
    expect(screen.getByText('Most Useful')).toBeInTheDocument();
    expect(renderedComments()).toEqual([
      'comment 3',
      'comment 1',
      'comment 2',
      'comment 4',
      'comment 5',
    ]);
  });
});

const getWrapper = (onLoaded: () => void) =>
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <CommentSectionSupabase
          authors={[]}
          sourceId={1}
          sourceType="projects"
          onLoaded={onLoaded}
        />
      </MemoryRouter>
    </ThemeProvider>,
  );

describe('CommentSectionSupabase onLoaded', () => {
  beforeEach(() => {
    mockGetComments.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('reports onLoaded once the comments have been fetched', async () => {
    mockGetComments.mockResolvedValue([]);
    const onLoaded = vi.fn();

    act(() => {
      getWrapper(onLoaded);
    });

    await waitFor(() => {
      expect(onLoaded).toHaveBeenCalledTimes(1);
    });
    await act(async () => {});
    expect(mockGetComments).toHaveBeenCalledTimes(1);
    expect(onLoaded).toHaveBeenCalledTimes(1);
  });

  it('reports onLoaded when the fetch fails', async () => {
    const error = new Error('Network error');
    mockGetComments.mockRejectedValue(error);
    const onLoaded = vi.fn();

    act(() => {
      getWrapper(onLoaded);
    });

    await waitFor(() => {
      expect(onLoaded).toHaveBeenCalledTimes(1);
    });
    await act(async () => {});
    expect(logger.error).toHaveBeenCalledWith(error);
    expect(onLoaded).toHaveBeenCalledTimes(1);
  });
});
