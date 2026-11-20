import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@theme-ui/core';
import { theme } from 'oa-themes';
import { MemoryRouter } from 'react-router';
import { FactoryUser } from 'src/test/factories/User';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CreateCommentSupabase } from './CreateCommentSupabase';

const mockUseProfileStore = vi.hoisted(() => vi.fn());

vi.mock('src/stores/Profile/profile.store', () => ({
  useProfileStore: mockUseProfileStore,
  ProfileStoreProvider: ({ children }: { children: React.ReactNode }) => children,
}));

const renderComponent = () =>
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <CreateCommentSupabase onSubmit={vi.fn()} sourceType="questions" />
      </MemoryRouter>
    </ThemeProvider>,
  ).container;

describe('CreateCommentSupabase', () => {
  beforeEach(() => {
    mockUseProfileStore.mockReset();
  });

  it('prompts logged out users to log in', () => {
    mockUseProfileStore.mockReturnValue({ profile: undefined, isComplete: null });

    const container = renderComponent();

    expect(container.querySelector('[data-cy=comments-login-prompt]')).toBeInTheDocument();
    expect(container.querySelector('[data-cy=comments-form]')).not.toBeInTheDocument();
  });

  it('prompts users with an incomplete profile to complete it', () => {
    mockUseProfileStore.mockReturnValue({ profile: FactoryUser(), isComplete: false });

    const container = renderComponent();

    expect(
      container.querySelector('[data-cy=comments-incomplete-profile-prompt]'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Complete your profile to leave a comment' }),
    ).toHaveAttribute('href', '/settings/profile');
    expect(container.querySelector('[data-cy=comments-form]')).not.toBeInTheDocument();
  });

  it('shows the comment form when the profile is complete', () => {
    mockUseProfileStore.mockReturnValue({ profile: FactoryUser(), isComplete: true });

    const container = renderComponent();

    expect(container.querySelector('[data-cy=comments-form]')).toBeInTheDocument();
    expect(
      container.querySelector('[data-cy=comments-incomplete-profile-prompt]'),
    ).not.toBeInTheDocument();
  });
});
