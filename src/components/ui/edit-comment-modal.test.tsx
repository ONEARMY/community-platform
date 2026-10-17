import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EditCommentModal } from './edit-comment-modal';

const renderModal = (props: Partial<Parameters<typeof EditCommentModal>[0]> = {}) => {
  const onClose = vi.fn();
  const onSubmit = vi.fn(async () => new Response(null, { status: 204 }));
  render(
    <EditCommentModal
      isOpen
      comment="A short comment"
      onClose={onClose}
      onSubmit={onSubmit}
      {...props}
    />,
  );
  return { onClose, onSubmit };
};

describe('EditCommentModal', () => {
  it('titles comments and replies', () => {
    renderModal({ isReply: true });

    expect(screen.getByText('Edit Reply')).toBeInTheDocument();
  });

  it('submits the trimmed text and closes', async () => {
    const { onClose, onSubmit } = renderModal();
    const input = screen.getByRole('textbox');

    await userEvent.clear(input);
    await userEvent.type(input, '  Updated  ');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(onSubmit).toHaveBeenCalledWith('Updated');
    expect(onClose).toHaveBeenCalled();
  });

  it('disables save when the comment is blank', async () => {
    renderModal();

    await userEvent.clear(screen.getByRole('textbox'));

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
  });

  it('shows the error and stays open when saving fails', async () => {
    const { onClose } = renderModal({
      onSubmit: async () => new Response(null, { status: 500, statusText: 'Error updating' }),
    });

    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(screen.getByText('Error updating')).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });
});
