/** @jsxImportSource theme-ui */

import { useEffect, useRef } from 'react';
import type { ThemeUIStyleObject } from 'theme-ui';
import { Box } from 'theme-ui';

export interface Props {
  isOpen: boolean;
  onDismiss: () => void;
  children: React.ReactNode;
  width?: number;
  height?: number;
  maxWidth?: string;
  maxHeight?: string | string[];
  backdropColor?: string;
  sx?: ThemeUIStyleObject;
}

export const Modal = (props: Props) => {
  const {
    children,
    width = 300,
    height,
    isOpen,
    maxWidth = '90vw',
    maxHeight = '95vh',
    backdropColor,
    sx,
    onDismiss,
  } = props;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const mouseDownOutsideRef = useRef(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    const rect = dialog.getBoundingClientRect();
    mouseDownOutsideRef.current =
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom;
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    // Only close if both mousedown and mouseup happened outside the modal
    const rect = dialog.getBoundingClientRect();
    const clickedOutside =
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom;

    if (mouseDownOutsideRef.current && clickedOutside) {
      onDismiss?.();
    }
  };

  const handleClose = () => {
    onDismiss?.();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <dialog
      ref={dialogRef}
      onMouseDown={handleMouseDown}
      onClick={handleBackdropClick}
      onClose={handleClose}
      sx={{
        padding: 0,
        border: 'none',
        borderRadius: '10px',
        maxWidth,
        maxHeight,
        ...(backdropColor ? { '&::backdrop': { background: backdropColor } } : {}),
      }}
    >
      <Box
        sx={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: width,
          height: height,
          maxWidth: 'inherit',
          background: 'white',
          border: '2px solid black',
          borderRadius: '10px',
          ...sx,
        }}
      >
        {children}
      </Box>
    </dialog>
  );
};
