import '@testing-library/jest-dom/vitest';
import React from 'react';
import { act, cleanup, fireEvent, render as testingRender, screen, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@theme-ui/core';
import type { Comment, DiscussionContentType } from 'oa-shared';
import { theme } from 'oa-themes';
import { MemoryRouter } from 'react-router';
import { FactoryComment } from 'src/test/factories/Comment';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CommentSectionSupabase } from './CommentSectionSupabase';
import { CommentSortOption } from './CommentSortOptions';

const mockGetComments = vi.hoisted(() => vi.fn());

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
    <div data-cy="comment-text" data-testid={`comment-${comment.id}`}>
      {comment.comment}
    </div>
  ),
}));

afterEach(cleanup);

const render = (ui: React.ReactNode) =>
  testingRender(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

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
    <MemoryRouter>
      <CommentSectionSupabase
        authors={[]}
        sourceId={1}
        sourceType="questions"
        defaultSortBy={defaultSortBy}
      />
    </MemoryRouter>,
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

const fixtures = () =>
  Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    createdAt: new Date(2026, 0, i + 1),
    comment: 'text ' + (i + 1),
    voteCount: i,
    replies: [],
  }));
describe('actual comment-section permalink destination', () => {
  it.each(['abc', '', '0', '-1', '1.5', 'Infinity', '9007199254740992'])(
    'loads ordinary comments for an invalid comment fragment %s',
    async (fragment) => {
      mockGetComments.mockReset().mockResolvedValue(buildComments(12));
      render(
        <MemoryRouter initialEntries={[`/library/example#comment:${fragment}`]}>
          <CommentSectionSupabase authors={[]} sourceId={1} sourceType="projects" />
        </MemoryRouter>,
      );

      await waitFor(() => expect(screen.getAllByTestId(/comment-/)).toHaveLength(10));
      expect(mockGetComments).toHaveBeenCalledWith('projects', 1, undefined);
      expect(screen.getByText('show 2 more comments')).toBeInTheDocument();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    },
  );

  it('reveals the linked question comment after MostUseful sorting', async () => {
    mockGetComments.mockResolvedValue(fixtures() as any);
    render(
      <MemoryRouter initialEntries={['/questions/example#comment:1']}>
        <CommentSectionSupabase
          authors={[]}
          sourceId={1}
          sourceType="questions"
          defaultSortBy={CommentSortOption.MostUseful}
        />
      </MemoryRouter>,
    );
    await waitFor(() => expect(screen.getAllByTestId(/comment-/)).toHaveLength(12));
    expect(mockGetComments).toHaveBeenCalledWith('questions', 1, '1');
    expect(screen.getByTestId('comment-1')).toBeTruthy();
    expect(screen.queryByText('show 2 more comments')).toBeNull();
  });
  it('does display the same linked comment with default chronological ordering', async () => {
    mockGetComments.mockResolvedValue(fixtures() as any);
    render(
      <MemoryRouter initialEntries={['/library/example#comment:1']}>
        <CommentSectionSupabase authors={[]} sourceId={1} sourceType="projects" />
      </MemoryRouter>,
    );
    await waitFor(() => expect(screen.getByTestId('comment-1')).toBeTruthy());
  });
});

it('reveals the parent of a highlighted reply after sorting', async () => {
  const rows = fixtures();
  rows[0].replies = [{ id: 99, parentId: 1 }] as never[];
  mockGetComments.mockResolvedValue(rows as never);
  render(
    <MemoryRouter initialEntries={['/questions/example#comment:99']}>
      <CommentSectionSupabase
        authors={[]}
        sourceId={1}
        sourceType="questions"
        defaultSortBy={CommentSortOption.MostUseful}
      />
    </MemoryRouter>,
  );
  await waitFor(() => expect(screen.getByTestId('comment-1')).toBeTruthy());
  expect(mockGetComments).toHaveBeenCalledWith('questions', 1, '99');
});

it('does not hide a highlighted comment displaced by a pinned answer', async () => {
  mockGetComments.mockResolvedValue(fixtures() as never);
  render(
    <MemoryRouter initialEntries={['/questions/example#comment:10']}>
      <CommentSectionSupabase
        authors={[]}
        sourceId={1}
        sourceType="questions"
        pinnedCommentId={12}
      />
    </MemoryRouter>,
  );
  await waitFor(() => expect(screen.getByTestId('comment-10')).toBeTruthy());
  expect(screen.getAllByTestId(/comment-/)).toHaveLength(11);
  expect(screen.getByText('show 1 more comment')).toBeTruthy();
});

it('expands immediately from a deep-linked visible range', async () => {
  const rows = Array.from({ length: 70 }, (_, i) => ({
    id: i + 1,
    createdAt: new Date(2026, 0, i + 1),
    comment: `text ${i + 1}`,
    replies: [],
  }));
  mockGetComments.mockResolvedValue(rows as never);
  render(
    <MemoryRouter initialEntries={['/library/example#comment:51']}>
      <CommentSectionSupabase authors={[]} sourceId={1} sourceType="projects" />
    </MemoryRouter>,
  );
  await waitFor(() => expect(screen.getAllByTestId(/comment-/)).toHaveLength(51));
  fireEvent.click(screen.getByText('show 19 more comments'));
  expect(screen.getAllByTestId(/comment-/)).toHaveLength(61);
});

const deferredComments = () => {
  let resolve!: (comments: Comment[]) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<Comment[]>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
};

const discussion = (sourceType: DiscussionContentType, sourceId = 1) => (
  <ThemeProvider theme={theme}>
    <MemoryRouter>
      <CommentSectionSupabase authors={[]} sourceId={sourceId} sourceType={sourceType} />
    </MemoryRouter>
  </ThemeProvider>
);

describe('comment section loading lifecycle', () => {
  beforeEach(() => mockGetComments.mockReset());

  it('refetches when the source type changes while the source ID stays the same', async () => {
    mockGetComments
      .mockResolvedValueOnce([FactoryComment({ id: 41, comment: 'Question comment' })])
      .mockResolvedValueOnce([FactoryComment({ id: 42, comment: 'News comment' })]);
    const view = testingRender(discussion('questions'));
    await screen.findByText('Question comment');

    view.rerender(discussion('news'));
    await screen.findByText('News comment');
    expect(screen.queryByText('Question comment')).not.toBeInTheDocument();
    expect(mockGetComments).toHaveBeenNthCalledWith(1, 'questions', 1, undefined);
    expect(mockGetComments).toHaveBeenNthCalledWith(2, 'news', 1, undefined);
  });

  it('ignores an older source response after the current discussion has loaded', async () => {
    const older = deferredComments();
    mockGetComments
      .mockReturnValueOnce(older.promise)
      .mockResolvedValueOnce([FactoryComment({ id: 42, comment: 'Current comment' })]);
    const view = testingRender(discussion('questions', 1));
    view.rerender(discussion('questions', 2));
    await screen.findByText('Current comment');

    await act(async () => {
      older.resolve([FactoryComment({ id: 41, comment: 'Stale comment' })]);
      await older.promise;
    });
    expect(screen.getByText('Current comment')).toBeInTheDocument();
    expect(screen.queryByText('Stale comment')).not.toBeInTheDocument();
  });

  it('ignores a cancelled load failure after the current source succeeds', async () => {
    const older = deferredComments();
    mockGetComments
      .mockReturnValueOnce(older.promise)
      .mockResolvedValueOnce([FactoryComment({ id: 42, comment: 'Current comment' })]);
    const view = testingRender(discussion('questions', 1));
    view.rerender(discussion('questions', 2));
    await screen.findByText('Current comment');

    await act(async () => {
      older.reject(new Error('old source unavailable'));
      await older.promise.catch(() => undefined);
    });
    expect(screen.getByText('Current comment')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('shows a current load error and clears it when another source starts loading', async () => {
    const next = deferredComments();
    mockGetComments
      .mockRejectedValueOnce(new Error('current source unavailable'))
      .mockReturnValueOnce(next.promise);
    const view = testingRender(discussion('questions', 1));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Could not load comments. Please try again.',
    );

    view.rerender(discussion('questions', 2));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    await act(async () => {
      next.resolve([FactoryComment({ id: 42, comment: 'Recovered comment' })]);
      await next.promise;
    });
    expect(screen.getByText('Recovered comment')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
