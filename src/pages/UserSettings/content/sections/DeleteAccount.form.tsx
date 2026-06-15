import { Accordion, Button, ConfirmModal, FieldInput } from 'oa-components';
import { useState } from 'react';
import { Form } from 'react-final-form';
import { useNavigate } from 'react-router';
import { PasswordField } from 'src/common/Form/PasswordField';
import { useToast } from 'src/common/Toast';
import { FormFieldWrapper } from 'src/pages/common/FormFields';
import { buttons, fields } from 'src/pages/UserSettings/labels';
import { Flex } from 'theme-ui';
import { accountService } from '../../services/account.service';

interface IFormValues {
  password: string;
}

export const DeleteAccountForm = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingPassword, setPendingPassword] = useState('');

  const formId = 'deleteAccount';

  const onSubmit = (values: IFormValues) => {
    setPendingPassword(values.password);
    setIsConfirmOpen(true);
  };

  const onConfirm = async () => {
    setIsConfirmOpen(false);

    toast.promise(accountService.deleteAccount(pendingPassword), {
      loading: 'Deleting your account...',
      success: () => {
        // Navigate after successful deletion
        navigate('/');
        return 'Your account has been deleted';
      },
      error: (error) => {
        return error.message || 'Failed to delete account';
      },
    });
  };

  return (
    <Flex data-cy="deleteAccountContainer" sx={{ flexDirection: 'column', gap: 2 }}>
      <Accordion title={fields.deleteAccount.title} subtitle={fields.deleteAccount.description}>
        <Form
          onSubmit={onSubmit}
          id={formId}
          render={({ handleSubmit, submitting, values }) => {
            const disabled = submitting || !values.password;

            return (
              <Flex data-cy="deleteAccountForm" sx={{ flexDirection: 'column', gap: 2 }}>
                <FormFieldWrapper text={fields.password.title} htmlFor="password" required>
                  <PasswordField
                    autoComplete="off"
                    component={FieldInput}
                    data-cy="deleteAccountPassword"
                    name="password"
                    placeholder="Password"
                    required
                  />
                </FormFieldWrapper>

                <Button
                  data-cy="deleteAccountSubmit"
                  disabled={disabled}
                  form={formId}
                  onClick={handleSubmit}
                  type="submit"
                  variant="destructive"
                  sx={{
                    alignSelf: 'flex-start',
                  }}
                >
                  {buttons.deleteAccount}
                </Button>
              </Flex>
            );
          }}
        />
      </Accordion>

      <ConfirmModal
        isOpen={isConfirmOpen}
        message="Delete Account - This action will:"
        confirmButtonText="Delete my account"
        handleCancel={() => setIsConfirmOpen(false)}
        handleConfirm={onConfirm}
        confirmVariant="destructive"
        checkboxLabel="I understand this action cannot be undone"
        width={500}
      >
        <ul>
          <li>Permanently delete your account</li>
          <li>Permanently delete your profile data</li>
          <li>Sign you out</li>
        </ul>
      </ConfirmModal>
    </Flex>
  );
};
