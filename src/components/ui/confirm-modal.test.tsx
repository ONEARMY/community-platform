import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ConfirmModal, type ConfirmModalProps } from './confirm-modal';

type HarnessProps = Partial<ConfirmModalProps> & {
  initialOpen?: boolean;
};

/**
 * Controlled wrapper mirroring real call sites: the parent owns `isOpen`
 * and closes the modal in its handleCancel/handleConfirm callbacks.
 */
function Harness({
  initialOpen = true,
  handleCancel,
  handleConfirm,
  ...props
}: HarnessProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  return (
    <main>
      <button type="button" onClick={() => setIsOpen(true)}>
        reopen
      </button>
      <ConfirmModal
        message={props.message ?? 'Are you sure?'}
        confirmButtonText={props.confirmButtonText ?? 'Confirm'}
        isOpen={isOpen}
        handleCancel={() => {
          setIsOpen(false);
          handleCancel?.();
        }}
        handleConfirm={() => {
          setIsOpen(false);
          handleConfirm?.();
        }}
        width={props.width}
        cancelVariant={props.cancelVariant}
        confirmVariant={props.confirmVariant}
        checkboxLabel={props.checkboxLabel}
      >
        {props.children}
      </ConfirmModal>
    </main>
  );
}

describe('ConfirmModal', () => {
  describe('rendering', () => {
    it('renders nothing when closed', () => {
      render(<Harness initialOpen={false} />);

      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
      expect(screen.queryByTestId('Confirm.modal: Modal')).not.toBeInTheDocument();
    });

    it('renders an alertdialog when open', () => {
      render(<Harness />);

      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    it('shows the message as its accessible title', () => {
      render(<Harness message="Delete this project?" />);

      const dialog = screen.getByRole('alertdialog');
      expect(screen.getByText('Delete this project?')).toBeInTheDocument();
      expect(dialog).toHaveAccessibleName('Delete this project?');
    });

    it('always renders a Cancel button with the fixed label', () => {
      render(<Harness />);

      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    it('renders the custom confirm button text', () => {
      render(<Harness confirmButtonText="Yes, delete it" />);

      expect(
        screen.getByRole('button', { name: 'Confirm Yes, delete it action' }),
      ).toHaveTextContent('Yes, delete it');
    });

    it('renders children content inside the dialog', () => {
      render(
        <Harness>
          <p>You have unsaved changes.</p>
        </Harness>,
      );

      expect(screen.getByText('You have unsaved changes.')).toBeInTheDocument();
    });

    it('applies the width prop as an inline style', () => {
      render(<Harness width={500} />);

      expect(screen.getByRole('alertdialog')).toHaveStyle({ width: '500px' });
    });

    it('does not set an inline width when no width is given', () => {
      render(<Harness />);

      // Base UI sets its own --nested-dialogs variable, so check for width
      expect(screen.getByRole('alertdialog').style.width).toBe('');
    });
  });

  describe('callbacks', () => {
    it('calls handleCancel once when Cancel is clicked', async () => {
      const user = userEvent.setup();
      const handleCancel = vi.fn();
      render(<Harness handleCancel={handleCancel} />);

      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(handleCancel).toHaveBeenCalledTimes(1);
    });

    it('calls handleConfirm once when Confirm is clicked', async () => {
      const user = userEvent.setup();
      const handleConfirm = vi.fn();
      render(<Harness handleConfirm={handleConfirm} />);

      await user.click(screen.getByRole('button', { name: 'Confirm Confirm action' }));

      expect(handleConfirm).toHaveBeenCalledTimes(1);
    });

    it('does not call handleConfirm when Cancel is clicked', async () => {
      const user = userEvent.setup();
      const handleConfirm = vi.fn();
      render(<Harness handleConfirm={handleConfirm} />);

      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(handleConfirm).not.toHaveBeenCalled();
    });

    it('does not call handleCancel when Confirm is clicked', async () => {
      const user = userEvent.setup();
      const handleCancel = vi.fn();
      render(<Harness handleCancel={handleCancel} />);

      await user.click(screen.getByRole('button', { name: 'Confirm Confirm action' }));

      expect(handleCancel).not.toHaveBeenCalled();
    });

    it('closes the dialog after Cancel (parent-controlled)', async () => {
      const user = userEvent.setup();
      render(<Harness />);

      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      await waitFor(() =>
        expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument(),
      );
    });

    it('closes the dialog after Confirm (parent-controlled)', async () => {
      const user = userEvent.setup();
      render(<Harness />);

      await user.click(screen.getByRole('button', { name: 'Confirm Confirm action' }));

      await waitFor(() =>
        expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument(),
      );
    });

    it('does not call handleCancel when Escape is pressed', async () => {
      const user = userEvent.setup();
      const handleCancel = vi.fn();
      render(<Harness handleCancel={handleCancel} />);

      await user.keyboard('{Escape}');

      expect(handleCancel).not.toHaveBeenCalled();
    });
  });

  describe('checkbox gating', () => {
    it('renders no checkbox when checkboxLabel is not provided', () => {
      render(<Harness />);

      expect(
        screen.queryByTestId('Confirm.modal: Checkbox'),
      ).not.toBeInTheDocument();
    });

    it('keeps Confirm enabled when no checkboxLabel is provided', () => {
      render(<Harness />);

      expect(
        screen.getByRole('button', { name: 'Confirm Confirm action' }),
      ).toBeEnabled();
    });

    it('renders the checkbox with its label when provided', () => {
      render(<Harness checkboxLabel="I understand this action cannot be undone" />);

      expect(
        screen.getByText('I understand this action cannot be undone'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('Confirm.modal: Checkbox')).toBeInTheDocument();
    });

    it('disables Confirm until the checkbox is checked', () => {
      render(<Harness checkboxLabel="I understand" />);

      expect(
        screen.getByRole('button', { name: 'Confirm Confirm action' }),
      ).toBeDisabled();
    });

    it('enables Confirm once the checkbox is checked', async () => {
      const user = userEvent.setup();
      render(<Harness checkboxLabel="I understand" />);

      await user.click(screen.getByTestId('Confirm.modal: Checkbox'));

      expect(
        screen.getByRole('button', { name: 'Confirm Confirm action' }),
      ).toBeEnabled();
    });

    it('re-disables Confirm when the checkbox is unchecked again', async () => {
      const user = userEvent.setup();
      render(<Harness checkboxLabel="I understand" />);
      const checkbox = screen.getByTestId('Confirm.modal: Checkbox');

      await user.click(checkbox);
      await user.click(checkbox);

      expect(
        screen.getByRole('button', { name: 'Confirm Confirm action' }),
      ).toBeDisabled();
    });

    it('does not fire handleConfirm when clicking the disabled Confirm', async () => {
      const user = userEvent.setup();
      const handleConfirm = vi.fn();
      render(<Harness checkboxLabel="I understand" handleConfirm={handleConfirm} />);

      await user.click(screen.getByRole('button', { name: 'Confirm Confirm action' }));

      expect(handleConfirm).not.toHaveBeenCalled();
    });

    it('fires handleConfirm when checked first, then Confirm is clicked', async () => {
      const user = userEvent.setup();
      const handleConfirm = vi.fn();
      render(
        <Harness checkboxLabel="I understand" handleConfirm={handleConfirm} />,
      );

      await user.click(screen.getByTestId('Confirm.modal: Checkbox'));
      await user.click(screen.getByRole('button', { name: 'Confirm Confirm action' }));

      expect(handleConfirm).toHaveBeenCalledTimes(1);
    });

    it('resets the checkbox after Cancel, so Confirm starts disabled on reopen', async () => {
      const user = userEvent.setup();
      render(<Harness checkboxLabel="I understand" />);

      await user.click(screen.getByTestId('Confirm.modal: Checkbox'));
      await user.click(screen.getByRole('button', { name: 'Cancel' }));
      await user.click(screen.getByRole('button', { name: 'reopen' }));

      expect(
        screen.getByRole('button', { name: 'Confirm Confirm action' }),
      ).toBeDisabled();
    });

    it('resets the checkbox after Confirm, so Confirm starts disabled on reopen', async () => {
      const user = userEvent.setup();
      render(<Harness checkboxLabel="I understand" />);

      await user.click(screen.getByTestId('Confirm.modal: Checkbox'));
      await user.click(screen.getByRole('button', { name: 'Confirm Confirm action' }));
      await user.click(screen.getByRole('button', { name: 'reopen' }));

      expect(
        screen.getByRole('button', { name: 'Confirm Confirm action' }),
      ).toBeDisabled();
    });
  });

  describe('variants', () => {
    it('styles Confirm with the primary variant by default', () => {
      render(<Harness />);

      expect(
        screen.getByRole('button', { name: 'Confirm Confirm action' }),
      ).toHaveClass('bg-primary');
    });

    it('styles Cancel with the outline variant by default', () => {
      render(<Harness />);

      expect(screen.getByRole('button', { name: 'Cancel' })).toHaveClass(
        'border-border',
        'bg-background',
      );
    });

    it('styles Confirm with the destructive variant when requested', () => {
      render(<Harness confirmVariant="destructive" />);

      expect(
        screen.getByRole('button', { name: 'Confirm Confirm action' }),
      ).toHaveClass('bg-destructive/10');
    });

    it('styles Cancel with the destructive variant when requested', () => {
      render(<Harness cancelVariant="destructive" />);

      expect(screen.getByRole('button', { name: 'Cancel' })).toHaveClass(
        'bg-destructive/10',
      );
    });

    it('styles Confirm with the outline variant when requested', () => {
      render(<Harness confirmVariant="outline" />);

      expect(
        screen.getByRole('button', { name: 'Confirm Confirm action' }),
      ).not.toHaveClass('bg-primary');
    });
  });

  describe('legacy test selectors', () => {
    it('keeps the data-testid/data-cy contract used by e2e tests', () => {
      render(<Harness checkboxLabel="I understand" />);

      expect(screen.getByTestId('Confirm.modal: Modal')).toHaveAttribute(
        'data-cy',
        'Confirm.modal: Modal',
      );
      expect(screen.getByTestId('Confirm.modal: Cancel')).toHaveAttribute(
        'data-cy',
        'Confirm.modal: Cancel',
      );
      expect(screen.getByTestId('Confirm.modal: Confirm')).toHaveAttribute(
        'data-cy',
        'Confirm.modal: Confirm',
      );
      expect(screen.getByTestId('Confirm.modal: Checkbox')).toHaveAttribute(
        'data-cy',
        'Confirm.modal: Checkbox',
      );
    });

    it('exposes the confirm aria-label pattern from the legacy component', () => {
      render(<Harness confirmButtonText="Delete" />);

      expect(
        screen.getByRole('button', { name: 'Confirm Delete action' }),
      ).toBeInTheDocument();
    });
  });
});
