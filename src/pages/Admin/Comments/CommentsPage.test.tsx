import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import type { AdminComment } from 'oa-shared';
import { createMemoryRouter, RouterProvider } from 'react-router';
import userEvent from '@testing-library/user-event';
import { commentService } from 'src/services/commentService';
import { FactoryAdminComment } from 'src/test/factories/Comment';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CommentsPage } from './CommentsPage';

vi.mock('src/services/commentService', () => ({ commentService: { editComment: vi.fn() } }));
beforeEach(() => vi.clearAllMocks());

const comment = FactoryAdminComment({
  liveUrl: '/library/build#comment:41',
  id: 41,
  comment: 'Nice build, how long did the mould take?',
  sourceType: 'projects',
  isReply: false,
  createdAt: new Date('2026-08-20T10:00:00Z'),
  deleted: false,
  author: { username: 'maker', displayName: 'Maker One' },
  notificationCount: 2,
});

const renderPage = (comments: AdminComment[], page = 1, totalPages = 1) => {
  const loader = vi.fn(() => null);
  const router = createMemoryRouter(
    [
      {
        path: '/admin/comments',
        loader,
        element: <CommentsPage comments={comments} page={page} totalPages={totalPages} />,
      },
    ],
    { initialEntries: ['/admin/comments'], hydrationData: { loaderData: { '0': null } } },
  );
  render(<RouterProvider router={router} />);
  return { loader };
};

describe('CommentsPage', () => {
  it('lists each comment with its type, preview link, creator, date and notification count', () => {
    renderPage([comment]);

    expect(screen.getByRole('heading', { name: 'Comments' })).toBeInTheDocument();
    expect(screen.getByText('Project')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Nice build, how long did the mould take?' }),
    ).toHaveAttribute('href', '/library/build#comment:41');
    expect(screen.getByRole('link', { name: 'Maker One' })).toHaveAttribute('href', '/u/maker');
    expect(screen.getByText('20 Aug 2026')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.queryByRole('navigation', { name: 'pagination' })).not.toBeInTheDocument();
  });

  it('marks replies and greys out deleted comments', () => {
    renderPage([FactoryAdminComment({ ...comment, isReply: true, deleted: true, liveUrl: null })]);

    const row = screen.getByRole('button', { name: 'View full comment 41' }).closest('tr');
    expect(row).toHaveClass('text-muted-foreground');
    expect(row).toHaveTextContent('Project reply (deleted)');
  });

  it('renders a creator without a username as plain text', () => {
    renderPage([
      FactoryAdminComment({ ...comment, author: { ...comment.author!, username: null } }),
    ]);

    expect(screen.getByText('Maker One')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Maker One' })).not.toBeInTheDocument();
  });

  it('renders a comment whose creator is gone as unknown', () => {
    renderPage([FactoryAdminComment({ ...comment, author: null })]);

    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });

  it('shows an empty state when there are no comments', () => {
    renderPage([]);

    expect(screen.getByText('No comments yet.')).toBeInTheDocument();
  });

  it('renders the pager when there is more than one page', () => {
    renderPage([comment], 2, 3);

    expect(screen.getByRole('link', { name: 'Go to next page' })).toHaveAttribute(
      'href',
      '/admin/comments?page=3',
    );
  });
});

it('opens unavailable text in an accessible dialog without offering deleted edits', async () => {
  renderPage([{ ...comment, deleted: true, liveUrl: null }]);
  await userEvent.click(screen.getByRole('button', { name: 'View full comment 41' }));
  expect(
    within(screen.getByRole('dialog', { name: 'View comment' })).getByText(comment.comment),
  ).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Edit comment 41' })).not.toBeInTheDocument();
});

it('saves edits through the existing API and refreshes the page after success', async () => {
  vi.mocked(commentService.editComment).mockResolvedValue(new Response(null, { status: 204 }));
  const { loader } = renderPage([comment]);
  await userEvent.click(screen.getByRole('button', { name: 'Edit comment 41' }));
  await userEvent.clear(screen.getByLabelText('Comment'));
  await userEvent.type(screen.getByLabelText('Comment'), 'Updated text');
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  expect(commentService.editComment).toHaveBeenCalledWith(comment.sourceId, 41, 'Updated text');
  expect(loader).toHaveBeenCalled();
});

it.each([
  'http',
  'network',
])('keeps failed %s edits open with visible error feedback', async (failure) => {
  if (failure === 'http') {
    vi.mocked(commentService.editComment).mockResolvedValue(new Response(null, { status: 500 }));
  } else {
    vi.mocked(commentService.editComment).mockRejectedValue(new Error('Network unavailable'));
  }
  renderPage([comment]);
  await userEvent.click(screen.getByRole('button', { name: 'Edit comment 41' }));
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(await screen.findByRole('alert')).toHaveTextContent(
    failure === 'http' ? 'Could not save' : 'Network unavailable',
  );
  expect(screen.getByRole('dialog')).toBeInTheDocument();
});

it('prevents empty edits and duplicate submissions', async () => {
  vi.mocked(commentService.editComment).mockReturnValue(new Promise(() => {}));
  renderPage([comment]);
  await userEvent.click(screen.getByRole('button', { name: 'Edit comment 41' }));
  await userEvent.clear(screen.getByLabelText('Comment'));
  await userEvent.type(screen.getByLabelText('Comment'), '   ');
  expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
  await userEvent.type(screen.getByLabelText('Comment'), 'Changed');
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(screen.getByRole('button', { name: 'Saving...' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
  expect(commentService.editComment).toHaveBeenCalledTimes(1);
});
