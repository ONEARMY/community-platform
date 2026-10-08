import '@testing-library/jest-dom/vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@theme-ui/core';
import { theme } from 'oa-themes';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { FactoryComment } from 'src/test/factories/Comment';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CommentItemSupabase } from './CommentItemSupabase';
import { CommentReply } from './CommentReplySupabase';

const mocks = vi.hoisted(() => ({
  profile: vi.fn(),
  subscription: vi.fn(),
  acceptedAnswer: vi.fn(),
  toggleFollow: vi.fn(),
  copyLink: vi.fn(),
}));

vi.mock('src/stores/Profile/profile.store', () => ({ useProfileStore: mocks.profile }));
vi.mock('src/stores/Subscription/useSubscription', () => ({ useSubscription: mocks.subscription }));
vi.mock('src/stores/UsefulVote/useUsefulVote', () => ({
  useUsefulVote: () => ({ hasVoted: false, usefulCount: 0, toggle: vi.fn() }),
}));
vi.mock('./hooks/useAcceptedAnswer', () => ({ useAcceptedAnswer: mocks.acceptedAnswer }));
vi.mock('./useCopyCommentLink', () => ({ useCopyCommentLink: () => mocks.copyLink }));

const comment = FactoryComment({
  id: 42,
  comment: 'A comment with actions',
  deleted: false,
  highlighted: false,
  replies: [],
  createdBy: {
    id: 1,
    username: 'author',
    displayName: 'Author',
    country: 'PT',
    badges: [],
    photo: null,
  },
});

const renderActions = (isReply = false) => {
  const router = createMemoryRouter([
    {
      path: '/',
      element: isReply ? (
        <CommentReply comment={comment} onEdit={vi.fn()} onDelete={vi.fn()} />
      ) : (
        <CommentItemSupabase
          comment={comment}
          sourceType="questions"
          onEdit={vi.fn()}
          onDelete={vi.fn()}
          onReply={vi.fn()}
          onEditReply={vi.fn()}
          onDeleteReply={vi.fn()}
        />
      ),
    },
    { path: '/sign-in', element: <p>Sign in page</p> },
  ]);
  render(
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>,
  );
  return router;
};

describe('Comment action menus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.profile.mockReturnValue({ profile: null });
    mocks.subscription.mockReturnValue({ isSubscribed: false, toggle: mocks.toggleFollow });
    mocks.acceptedAnswer.mockReturnValue(null);
  });

  it('redirects visitors to sign in when following replies', async () => {
    const user = userEvent.setup();
    const router = renderActions();
    await user.click(screen.getByRole('button', { name: 'Show Actions' }));
    await user.click(await screen.findByRole('menuitem', { name: 'Follow replies' }));

    expect(router.state.location.pathname).toBe('/sign-in');
    expect(new URLSearchParams(router.state.location.search).get('returnUrl')).toBe(
      location.pathname,
    );
    expect(mocks.toggleFollow).not.toHaveBeenCalled();
  });

  it.each([false, true])('toggles following replies when following is %s', async (isFollowing) => {
    const user = userEvent.setup();
    mocks.profile.mockReturnValue({ profile: { username: 'another-user', roles: [] } });
    mocks.subscription.mockReturnValue({ isSubscribed: isFollowing, toggle: mocks.toggleFollow });
    renderActions();
    await user.click(screen.getByRole('button', { name: 'Show Actions' }));
    await user.click(
      await screen.findByRole('menuitem', {
        name: isFollowing ? 'Unfollow replies' : 'Follow replies',
      }),
    );

    expect(mocks.toggleFollow).toHaveBeenCalledOnce();
  });

  it.each([
    false,
    true,
  ])('keeps copy link available without edit or delete for a visitor (reply: %s)', async (isReply) => {
    const user = userEvent.setup();
    renderActions(isReply);
    await user.click(screen.getByRole('button', { name: 'Show Actions' }));
    const copy = await screen.findByRole('menuitem', { name: 'Copy Link' });

    expect(screen.queryByRole('menuitem', { name: 'Edit' })).not.toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: 'Delete' })).not.toBeInTheDocument();
    await user.click(copy);
    expect(mocks.copyLink).toHaveBeenCalledOnce();
  });

  it.each([false, true])('shows edit and delete for the author (reply: %s)', async (isReply) => {
    const user = userEvent.setup();
    mocks.profile.mockReturnValue({ profile: { username: 'author', roles: [] } });
    renderActions(isReply);
    await user.click(screen.getByRole('button', { name: 'Show Actions' }));

    expect(await screen.findByRole('menuitem', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toBeInTheDocument();
  });

  it('does not accept an answer while the action is loading', async () => {
    const user = userEvent.setup();
    const onAccept = vi.fn();
    mocks.acceptedAnswer.mockReturnValue({
      canMarkAsAccepted: true,
      isLoading: true,
      isAccepted: false,
      onAccept,
    });
    renderActions();
    await user.click(screen.getByRole('button', { name: 'Show Actions' }));
    const action = await screen.findByRole('menuitem', { name: 'Mark as accepted answer' });

    expect(action).toHaveAttribute('aria-disabled', 'true');
    act(() => action.focus());
    await user.keyboard('{Enter}');
    expect(onAccept).not.toHaveBeenCalled();
  });
});
