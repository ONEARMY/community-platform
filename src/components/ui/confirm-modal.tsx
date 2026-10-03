'use client';

import { AlertDialog as AlertDialogPrimitive } from '@base-ui/react/alert-dialog';
import { type ReactNode, useLayoutEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

export interface ConfirmModalProps {
  message: string;
  confirmButtonText: string;
  isOpen: boolean;
  handleCancel: () => void;
  handleConfirm: () => void;
  width?: number;
  cancelVariant?: 'default' | 'outline' | 'destructive';
  confirmVariant?: 'default' | 'outline' | 'destructive';
  children?: ReactNode;
  checkboxLabel?: string;
}

export function ConfirmModal({
  message,
  confirmButtonText,
  isOpen,
  handleCancel,
  handleConfirm,
  width,
  cancelVariant = 'outline',
  confirmVariant = 'default',
  children,
  checkboxLabel,
}: ConfirmModalProps) {
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const isConfirmDisabled = Boolean(checkboxLabel) && !isCheckboxChecked;

  const onCancel = () => {
    setIsCheckboxChecked(false);
    handleCancel();
  };

  const onConfirm = () => {
    setIsCheckboxChecked(false);
    handleConfirm();
  };

  // When the modal is nested inside a native <dialog> (a ConfirmModal rendered
  // within an oa-components Modal, e.g. the remake form), the portal must go
  // INTO that dialog: a native dialog lives in the browser's top layer, so a
  // portal appended to <body> would paint behind it and become unclickable.
  // Everywhere else the portal defaults to <body> as usual.
  const anchorRef = useRef<HTMLSpanElement | null>(null);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  useLayoutEffect(() => {
    setPortalContainer(anchorRef.current?.closest('dialog') ?? null);
  }, []);

  return (
    <>
      <span ref={anchorRef} hidden />
      <AlertDialogPrimitive.Root open={isOpen}>
        <AlertDialogPrimitive.Portal container={portalContainer ?? undefined}>
          <AlertDialogPrimitive.Backdrop
            data-slot="confirm-modal-overlay"
            className="fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0"
          />
          <AlertDialogPrimitive.Popup
            data-slot="confirm-modal"
            data-cy="Confirm.modal: Modal"
            data-testid="Confirm.modal: Modal"
            className="fixed top-1/2 left-1/2 z-50 grid w-full max-w-dialog -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-sm text-popover-foreground duration-100 outline-none ring-1 ring-foreground/10 sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
            style={width ? { width, maxWidth: '90vw' } : undefined}
          >
            <AlertDialogPrimitive.Title className="self-stretch font-heading text-base leading-none font-medium font-bold">
              {message}
            </AlertDialogPrimitive.Title>

            {children ? <div className="flex flex-col gap-4">{children}</div> : null}

            {checkboxLabel ? (
              <label className="flex cursor-pointer items-center gap-2 self-stretch text-sm font-bold">
                <Checkbox
                  checked={isCheckboxChecked}
                  onCheckedChange={(checked) => setIsCheckboxChecked(checked !== false)}
                  data-cy="Confirm.modal: Checkbox"
                  data-testid="Confirm.modal: Checkbox"
                />
                {checkboxLabel}
              </label>
            ) : null}

            <div className={cn('flex flex-wrap gap-2', (children || checkboxLabel) && 'mt-2')}>
              <AlertDialogPrimitive.Close
                render={<Button type="button" variant={cancelVariant} />}
                data-cy="Confirm.modal: Cancel"
                data-testid="Confirm.modal: Cancel"
                onClick={onCancel}
              >
                Cancel
              </AlertDialogPrimitive.Close>
              <AlertDialogPrimitive.Close
                render={
                  <Button type="button" variant={confirmVariant} disabled={isConfirmDisabled} />
                }
                aria-label={`Confirm ${confirmButtonText} action`}
                data-cy="Confirm.modal: Confirm"
                data-testid="Confirm.modal: Confirm"
                onClick={onConfirm}
              >
                {confirmButtonText}
              </AlertDialogPrimitive.Close>
            </div>
          </AlertDialogPrimitive.Popup>
        </AlertDialogPrimitive.Portal>
      </AlertDialogPrimitive.Root>
    </>
  );
}
