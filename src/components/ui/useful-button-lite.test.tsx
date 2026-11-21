import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { UsefulConfig } from '@/components/ui/useful-button-lite';
import { UsefulButtonLite } from '@/components/ui/useful-button-lite';

const mockNavigate = vi.fn();
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

const renderButton = (props: UsefulConfig) =>
  render(
    <BrowserRouter>
      <UsefulButtonLite {...props} />
    </BrowserRouter>,
  );

describe('UsefulButtonLite', () => {
  const onUsefulClick = vi.fn();

  const defaultProps: UsefulConfig = {
    hasUserVotedUseful: false,
    votedUsefulCount: 5,
    isLoggedIn: true,
    onUsefulClick,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    onUsefulClick.mockResolvedValue(undefined);
  });

  it('shows the vote count', () => {
    renderButton(defaultProps);

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('does not show the count when there are no votes', () => {
    renderButton({ ...defaultProps, votedUsefulCount: 0 });

    expect(screen.queryByText('0')).not.toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('greys out the icon when the user has not voted', () => {
    renderButton(defaultProps);

    expect(screen.getByTestId('useful-icon')).toHaveClass('grayscale');
  });

  it('shows the icon in colour when the user has voted', () => {
    renderButton({ ...defaultProps, hasUserVotedUseful: true });

    expect(screen.getByTestId('useful-icon')).not.toHaveClass('grayscale');
  });

  it('adds a vote when the user has not voted', async () => {
    renderButton(defaultProps);

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => expect(onUsefulClick).toHaveBeenCalledWith('add', 'Comment'));
    expect(onUsefulClick).toHaveBeenCalledTimes(1);
  });

  it('removes the vote when the user has already voted', async () => {
    renderButton({ ...defaultProps, hasUserVotedUseful: true });

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => expect(onUsefulClick).toHaveBeenCalledWith('delete', 'Comment'));
  });

  it('disables the button while the vote is being saved', async () => {
    onUsefulClick.mockReturnValue(new Promise((resolve) => setTimeout(resolve, 100)));
    renderButton(defaultProps);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(button).toBeDisabled();
    await waitFor(() => expect(button).not.toBeDisabled());
  });

  it('redirects to sign-in when the user is not logged in', () => {
    renderButton({ ...defaultProps, isLoggedIn: false });

    fireEvent.click(screen.getByRole('button'));

    expect(mockNavigate).toHaveBeenCalledWith(
      `/sign-in?returnUrl=${encodeURIComponent(window.location.pathname)}`,
    );
    expect(onUsefulClick).not.toHaveBeenCalled();
  });

  it('re-enables the button when the vote request fails', async () => {
    onUsefulClick.mockRejectedValue(new Error('Network error'));
    renderButton(defaultProps);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => expect(onUsefulClick).toHaveBeenCalled());
    await waitFor(() => expect(button).not.toBeDisabled());
  });
});
