import { useState } from 'react';
import { Button, Modal } from 'oa-components';
import { Flex, Text, Input, Label } from 'theme-ui';

interface Props {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export const DeleteAccountModal = (props: Props) => {
  const { isOpen, onCancel, onConfirm, isDeleting = false } = props;
  const [confirmText, setConfirmText] = useState('');
  const isDeleteEnabled = confirmText === 'DELETE';

  const handleConfirm = () => {
    if (isDeleteEnabled) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    setConfirmText('');
    onCancel();
  };

  return (
    <Modal isOpen={isOpen} width={400} onDidDismiss={handleCancel}>
      <Flex
        data-cy="DeleteAccount.modal: Modal"
        sx={{
          alignItems: 'flex-start',
          flexDirection: 'column',
          padding: 1,
          gap: 3,
          justifyContent: 'flex-start',
        }}
      >
        <Text sx={{ alignSelf: 'stretch', fontWeight: 'bold', fontSize: 3 }}>
          Permanently delete this account?
        </Text>
        <Text sx={{ alignSelf: 'stretch' }}>
          Deleting your account will remove all your information from our database. This cannot be
          undone.
        </Text>
        <Flex sx={{ flexDirection: 'column', gap: 2, width: '100%' }}>
          <Label htmlFor="delete-confirm-input">
            Type <strong>DELETE</strong> to confirm:
          </Label>
          <Input
            id="delete-confirm-input"
            data-cy="DeleteAccount.modal: Input"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE"
            disabled={isDeleting}
            sx={{ width: '100%' }}
          />
        </Flex>
        <Flex sx={{ gap: 2, flexWrap: 'wrap', width: '100%', justifyContent: 'flex-end' }}>
          <Button
            type="button"
            variant="outline"
            data-cy="DeleteAccount.modal: Cancel"
            onClick={handleCancel}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            aria-label="Delete account"
            data-cy="DeleteAccount.modal: Confirm"
            variant="destructive"
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
