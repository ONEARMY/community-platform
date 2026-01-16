import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Button, Modal } from 'oa-components';
import { Box, Flex, Label, Text } from 'theme-ui';

interface Props {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

const DeleteAccountModalComponent = (props: Props) => {
  const { isOpen, onCancel, onConfirm, isDeleting = false } = props;
  const [confirmText, setConfirmText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const isDeleteEnabled = confirmText === 'DELETE';

  // Reset text when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setConfirmText('');
      // Focus input when modal opens
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    } else {
      setConfirmText('');
    }
  }, [isOpen]);

  // Keep focus on input after each keystroke - useLayoutEffect runs synchronously
  useLayoutEffect(() => {
    if (isOpen && inputRef.current) {
      const input = inputRef.current;
      const wasFocused = document.activeElement === input;
      // Restore focus if it was lost
      if (!wasFocused) {
        input.focus();
        // Restore cursor position
        const len = input.value.length;
        input.setSelectionRange(len, len);
      }
    }
  });

  const handleConfirm = useCallback(() => {
    const currentValue = inputRef.current?.value.toUpperCase() || confirmText;
    if (currentValue === 'DELETE') {
      onConfirm();
    }
  }, [confirmText, onConfirm]);

  const handleCancel = useCallback(() => {
    setConfirmText('');
    onCancel();
  }, [onCancel]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toUpperCase();
    setConfirmText(newValue);
    // Immediately refocus after state update
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, []);

  if (!isOpen) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} width={450} onDidDismiss={handleCancel}>
      <Flex
        data-cy="DeleteAccount.modal: Modal"
        sx={{
          alignItems: 'flex-start',
          flexDirection: 'column',
          padding: 4, // 20px
          gap: 3, // 15px
          justifyContent: 'flex-start',
        }}
      >
        {/* Header with title */}
        <Text
          sx={{
            fontWeight: 'bold',
            fontSize: '20px',
            color: 'black',
            lineHeight: 'tight',
            width: '100%',
          }}
        >
          Permanently delete this account?
        </Text>

        {/* Description */}
        <Text
          sx={{
            alignSelf: 'stretch',
            fontSize: '16px',
            color: 'grey',
            lineHeight: 'relaxed',
          }}
        >
          Deleting your account will remove all your information from our database. This cannot be
          undone.
        </Text>

        {/* Input Section */}
        <Flex sx={{ flexDirection: 'column', gap: 1, width: '100%' }}>
          <Label
            htmlFor="delete-confirm-input"
            sx={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'black',
            }}
          >
            Type "DELETE" to proceed
          </Label>
          <Box
            as="input"
            ref={inputRef}
            id="delete-confirm-input"
            data-cy="DeleteAccount.modal: Input"
            type="text"
            value={confirmText}
            onChange={handleInputChange}
            placeholder="DELETE"
            disabled={isDeleting}
            autoComplete="off"
            autoFocus
            sx={{
              width: '100%',
              padding: 2, // 10px
              border: '1px solid',
              borderColor: 'lightgrey',
              borderRadius: 1,
              fontFamily: 'body',
              fontSize: 3,
              '&:focus': {
                borderColor: 'black',
                outline: 'none',
              },
              '&::placeholder': {
                color: 'lightgrey',
                textTransform: 'uppercase',
              },
            }}
          />
        </Flex>

        {/* Action Buttons - Split to both ends */}
        <Flex
          sx={{
            gap: 2,
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 2, // 10px
          }}
        >
          <Button
            type="button"
            variant="outline"
            data-cy="DeleteAccount.modal: Cancel"
            onClick={handleCancel}
            disabled={isDeleting}
            sx={{
              '&:hover': {
                backgroundColor: 'offWhite',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            type="button"
            aria-label="Delete account"
            data-cy="DeleteAccount.modal: Confirm"
            variant="primary"
            onClick={handleConfirm}
            disabled={!isDeleteEnabled || isDeleting}
          >
            Delete account
          </Button>
        </Flex>
      </Flex>
    </Modal>
  );
};

export const DeleteAccountModal = memo(DeleteAccountModalComponent);
