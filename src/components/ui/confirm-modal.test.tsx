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

    it('defaults to the legacy 300px width when no width is given', () => {
      render(<Harness />);

      // the old oa-components Modal defaulted to width=300
      expect(screen.getByRole('alertdialog').style.width).toBe('300px');
      expect(screen.getByRole('alertdialog').style.maxWidth).toBe('90vw');
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
    it('styles Confirm with the default variant by default', () => {
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

    it('portals into the enclosing native dialog when nested in one', () => {
      // A ConfirmModal rendered inside an oa-components Modal lives inside a
      // native <dialog> (top layer); the portal must join it there or the
      // confirm dialog paints behind the form modal and cannot be clicked.
      const dialog = document.createElement('dialog');
      document.body.appendChild(dialog);
      dialog.showModal();
      const mount = document.createElement('div');
      dialog.appendChild(mount);

      render(<Harness />, { container: mount, baseElement: document.body });

      const popup = screen.getByTestId('Confirm.modal: Modal');
      expect(dialog.contains(popup)).toBe(true);

      dialog.remove();
    });

    it('portals to the body when not nested in a native dialog', () => {
      render(<Harness />);

      const popup = screen.getByTestId('Confirm.modal: Modal');
      expect(popup.closest('dialog')).toBeNull();
    });

    it('exposes the confirm aria-label pattern from the legacy component', () => {
      render(<Harness confirmButtonText="Delete" />);

      expect(
        screen.getByRole('button', { name: 'Confirm Delete action' }),
      ).toBeInTheDocument();
    });
  });

  describe('short viewport scrolling', () => {
    it('caps the popup height to the viewport', () => {
      render(<Harness />);

      expect(screen.getByTestId('Confirm.modal: Modal')).toHaveClass('max-h-screen');
    });

    it('stacks above the fixed page chrome', () => {
      // The legacy modal lived in a native <dialog> top layer, above the
      // header/bottom-nav z-index (3000). The portal replacement must stack
      // above that chrome too, or on short viewports the fixed bottom nav
      // covers the action buttons and they cannot be clicked.
      render(<Harness />);

      const popup = screen.getByTestId('Confirm.modal: Modal');
      expect(popup).toHaveClass('z-above-header');
      expect(document.querySelector('[data-slot="confirm-modal-overlay"]')).toHaveClass(
        'z-above-header',
      );
    });

    it('scrolls the body, not the buttons', () => {
      render(
        <Harness checkboxLabel="I understand">
          <ul>
            <li>first consequence</li>
            <li>second consequence</li>
          </ul>
        </Harness>,
      );

      const popup = screen.getByTestId('Confirm.modal: Modal');
      const body = popup.querySelector('[data-slot="confirm-modal-body"]');
      expect(body).not.toBeNull();
      expect(body).toHaveClass('overflow-y-auto');
      expect(body).toHaveClass('min-h-0');

      // The scrollable body carries the title, children and checkbox...
      expect(body?.contains(screen.getByText('Are you sure?'))).toBe(true);
      expect(body?.contains(screen.getByText('first consequence'))).toBe(true);
      expect(body?.contains(screen.getByTestId('Confirm.modal: Checkbox'))).toBe(true);

      // ...while the action buttons stay outside it so they remain reachable
      // when the content is taller than the viewport.
      const cancel = screen.getByTestId('Confirm.modal: Cancel');
      const confirm = screen.getByTestId('Confirm.modal: Confirm');
      expect(body?.contains(cancel)).toBe(false);
      expect(body?.contains(confirm)).toBe(false);
      expect(popup.contains(cancel)).toBe(true);
      expect(popup.contains(confirm)).toBe(true);
    });

    it('keeps the buttons as the last row of the popup', () => {
      render(<Harness />);

      const popup = screen.getByTestId('Confirm.modal: Modal');
      const buttons = screen.getByTestId('Confirm.modal: Cancel').parentElement;
      expect(popup.lastElementChild).toBe(buttons);
    });

    it('keeps tall content inside the scrollable body', () => {
      render(
        <Harness>
          <div>
            {Array.from({ length: 20 }, (_, i) => (
              <p key={i}>line {i}</p>
            ))}
          </div>
        </Harness>,
      );

      const body = screen
        .getByTestId('Confirm.modal: Modal')
        .querySelector('[data-slot="confirm-modal-body"]');
      expect(body?.contains(screen.getByText('line 0'))).toBe(true);
      expect(body?.contains(screen.getByText('line 19'))).toBe(true);
    });
  });
});
