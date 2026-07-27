import type { ReactNode } from 'react';
import { useState } from 'react';
import { Checkbox, Flex, Label, Text } from 'theme-ui';

import { Button } from '../Button/Button';
import { Modal } from '../Modal/Modal';

export interface Props {
  message: string;
  confirmButtonText: string;
  isOpen: boolean;
  handleCancel: () => void;
  handleConfirm: () => void;
  width?: number;
  cancelVariant?: 'outline' | 'destructive' | 'primary';
  confirmVariant?: 'outline' | 'destructive' | 'primary';
  children?: ReactNode;
  checkboxLabel?: string;
}

export const ConfirmModal = (props: Props) => {
  const {
    message,
    confirmButtonText,
    isOpen,
    width,
    confirmVariant = 'primary',
    cancelVariant = 'outline',
    children,
    checkboxLabel,
  } = props;

  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

  const handleCancel = () => {
    setIsCheckboxChecked(false);
    props.handleCancel();
  };

  const handleConfirm = () => {
    setIsCheckboxChecked(false);
    props.handleConfirm();
  };

  const isConfirmDisabled = !!checkboxLabel && !isCheckboxChecked;

  return (
    <Modal onDismiss={handleCancel} isOpen={isOpen} width={width}>
      <Flex
        data-cy="Confirm.modal: Modal"
        data-testid="Confirm.modal: Modal"
        sx={{
          alignItems: 'flex-start',
          flexDirection: 'column',
          padding: 1,
          gap: 2,
          justifyContent: 'flex-start',
        }}
      >
        <Text sx={{ alignSelf: 'stretch', fontWeight: 'bold' }}>{message}</Text>

        {children && (
          <Flex sx={{ flexDirection: 'column', gap: 2, width: '100%' }}>{children}</Flex>
        )}

        {checkboxLabel && (
          <Label
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: 2,
            }}
          >
            <Checkbox
              checked={isCheckboxChecked}
              onChange={(e) => setIsCheckboxChecked(e.target.checked)}
              data-cy="Confirm.modal: Checkbox"
              data-testid="Confirm.modal: Checkbox"
            />
            {checkboxLabel}
          </Label>
        )}

        <Flex sx={{ gap: 2, flexWrap: 'wrap', mt: checkboxLabel || children ? 2 : 0 }}>
          <Button
            type="button"
            variant={cancelVariant}
            data-cy="Confirm.modal: Cancel"
            data-testid="Confirm.modal: Cancel"
            onClick={handleCancel}
          >
            Cancel
          </Button>

          <Button
            type="button"
            aria-label={`Confirm ${confirmButtonText} action`}
            data-cy="Confirm.modal: Confirm"
            data-testid="Confirm.modal: Confirm"
            variant={confirmVariant}
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
          >
            {confirmButtonText}
          </Button>
        </Flex>
      </Flex>
    </Modal>
  );
};
