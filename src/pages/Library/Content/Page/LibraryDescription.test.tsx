import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@theme-ui/core';
import type { Author, Profile } from 'oa-shared';
import { UserRole } from 'oa-shared';
import { theme } from 'oa-themes';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { FactoryLibraryItem } from 'src/test/factories/Library';
import { FactoryUser } from 'src/test/factories/User';
import { describe, expect, it, vi } from 'vitest';
import { LibraryDescription } from './LibraryDescription';

vi.mock('src/stores/Profile/profile.store', () => ({
  useProfileStore: () => ({ profile: undefined }),
}));

const owner = FactoryUser({ username: 'project-owner', roles: [] }) as Profile;
const otherUser = FactoryUser({ username: 'someone-else', roles: [] }) as Profile;
const admin = FactoryUser({ username: 'an-admin', roles: [UserRole.ADMIN] }) as Profile;

const item = FactoryLibraryItem({
  moderation: 'improvements-needed',
  moderationFeedback: 'Please add more photos',
  isDraft: false,
  deleted: false,
  author: { id: owner.id, username: owner.username } as Author,
});

const renderDescription = (loggedInUser: Profile | undefined) => {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: (
          <LibraryDescription
            item={item}
            loggedInUser={loggedInUser}
            commentsCount={0}
            remakeCount={0}
            hasUserVotedUseful={false}
            onUsefulClick={vi.fn()}
          />
        ),
      },
    ],
    { initialEntries: ['/'] },
  );

  return render(
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>,
  );
};

describe('LibraryDescription moderation feedback', () => {
  it.each([
    { name: 'anonymous', user: undefined },
    { name: 'another user', user: otherUser },
  ])('shows the moderation status but hides feedback for $name', async ({ user }) => {
    const { container } = renderDescription(user);

    expect(
      container.querySelector('[data-cy="moderationstatus-improvements-needed"]'),
    ).toBeInTheDocument();
    expect(container.querySelector('[data-cy="moderationFeedback"]')).not.toBeInTheDocument();
  });

  it.each([
    { name: 'the content owner', user: owner },
    { name: 'an admin', user: admin },
  ])('shows feedback to $name', ({ user }) => {
    const { container } = renderDescription(user);

    expect(
      container.querySelector('[data-cy="moderationstatus-improvements-needed"]'),
    ).toBeInTheDocument();
    expect(container.querySelector('[data-cy="moderationFeedback"]')).toBeInTheDocument();
    expect(screen.getByText('Please add more photos')).toBeInTheDocument();
  });
});
