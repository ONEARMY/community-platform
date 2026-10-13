import '@testing-library/jest-dom/vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { UsefulButton, type UsefulButtonProps } from './useful-button';

function LocationDisplay() {
  const { pathname, search } = useLocation();
  return (
    <output>
      {pathname}
      {search}
    </output>
  );
}

function setup(props: Partial<UsefulButtonProps> = {}) {
  const onUsefulClick = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);
  const buttonProps = {
    isLoggedIn: true,
    hasUserVotedUseful: false,
    onUsefulClick,
    ...props,
  };
  const view = render(
    <MemoryRouter initialEntries={['/questions/a-question?tab=answers']}>
      <UsefulButton {...buttonProps} />
      <LocationDisplay />
    </MemoryRouter>,
  );
  return { ...view, user: userEvent.setup(), onUsefulClick, buttonProps };
}

describe('UsefulButton', () => {
  it('reflects the controlled vote state without toggling locally', async () => {
    const { user, onUsefulClick, buttonProps, rerender } = setup();
    const button = screen.getByRole('button', { name: 'Mark as useful' });
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).toHaveAttribute('data-cy', 'vote-useful');
    expect(button.querySelector('svg')).toHaveClass('grayscale');

    await user.click(button);
    await waitFor(() => expect(button).toBeEnabled());
    expect(onUsefulClick).toHaveBeenCalledTimes(1);
    expect(button).toHaveAttribute('aria-pressed', 'false');

    rerender(
      <MemoryRouter>
        <UsefulButton {...buttonProps} hasUserVotedUseful />
      </MemoryRouter>,
    );
    expect(screen.getByRole('button', { name: 'Marked as useful' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(button.querySelector('svg')).not.toHaveClass('grayscale');
  });

  it('redirects logged-out users with the encoded pathname without voting', async () => {
    const { user, onUsefulClick } = setup({ isLoggedIn: false });
    const button = screen.getByRole('button', { name: 'Mark as useful' });
    expect(button).toHaveAttribute('data-cy', 'vote-useful-redirect');
    await user.click(button);
    expect(screen.getByRole('status')).toHaveTextContent(
      '/sign-in?returnUrl=%2Fquestions%2Fa-question',
    );
    expect(onUsefulClick).not.toHaveBeenCalled();
  });

  it('shows login guidance on keyboard focus', async () => {
    const { user } = setup({ isLoggedIn: false });
    await user.tab();
    expect(await screen.findByText('Login to add your vote')).toBeVisible();
  });

  it('prevents repeated activation until the request finishes', async () => {
    let finish!: () => void;
    const onUsefulClick = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        }),
    );
    const { user } = setup({ onUsefulClick });
    const button = screen.getByRole('button', { name: 'Mark as useful' });
    await user.click(button);
    expect(button).toBeDisabled();
    await user.click(button);
    expect(onUsefulClick).toHaveBeenCalledTimes(1);
    await act(async () => finish());
    expect(button).toBeEnabled();
  });

  it('recovers from a rejected request and allows retry', async () => {
    const onUsefulClick = vi
      .fn()
      .mockRejectedValueOnce(new Error('Failed'))
      .mockResolvedValue(undefined);
    const { user } = setup({ onUsefulClick });
    const button = screen.getByRole('button', { name: 'Mark as useful' });
    await user.click(button);
    await waitFor(() => expect(button).toBeEnabled());
    expect(button).toHaveAttribute('aria-pressed', 'false');
    await user.click(button);
    expect(onUsefulClick).toHaveBeenCalledTimes(2);
  });

  it.each(['{Enter}', ' '])('supports keyboard activation with %s', async (key) => {
    const { user, onUsefulClick } = setup();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Mark as useful' })).toHaveFocus();
    await user.keyboard(key);
    expect(onUsefulClick).toHaveBeenCalledTimes(1);
  });

  it('allows undoing a selected vote', async () => {
    const { user, onUsefulClick } = setup({ hasUserVotedUseful: true });
    await user.click(screen.getByRole('button', { name: 'Marked as useful' }));
    expect(onUsefulClick).toHaveBeenCalledTimes(1);
  });
});
