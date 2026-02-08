import { useEffect, useRef } from 'react';
import type { ThemeUIStyleObject } from 'theme-ui';
import { Box } from 'theme-ui';

export interface Props {
  isOpen: boolean;
  children?: React.ReactNode;
  width?: number;
  height?: number;
  onDidDismiss?: () => void;
  sx?: ThemeUIStyleObject;
}

export const Modal = (props: Props) => {
  const { children, width = 300, height, isOpen, sx, onDidDismiss } = props;
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    // Only close if clicking the backdrop (::backdrop)
    const rect = dialog.getBoundingClientRect();
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
      onDidDismiss?.();
    }
  };

  const handleClose = () => {
    onDidDismiss?.();
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onClose={handleClose}
      style={{
        padding: 0,
        border: 'none',
        borderRadius: '10px',
        maxWidth: '100vw',
        maxHeight: '95vh',
        overflow: 'hidden',
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
          background: 'white',
          border: '2px solid black',
          borderRadius: '10px',
          overflow: 'auto',
          ...sx,
        }}
      >
        {children}
      </Box>
    </dialog>
  );
};
