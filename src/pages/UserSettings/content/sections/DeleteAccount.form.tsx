import { Accordion, Button, ConfirmModal, FieldInput } from 'oa-components';
import { useState } from 'react';
import { Form } from 'react-final-form';
import { useNavigate } from 'react-router';
import { PasswordField } from 'src/common/Form/PasswordField';
import { FormFieldWrapper } from 'src/pages/common/FormFields';
import type { SubmitResults } from 'src/pages/User/contact/UserContactError';
import { UserContactError } from 'src/pages/User/contact/UserContactError';
import { buttons, fields } from 'src/pages/UserSettings/labels';
import { Flex } from 'theme-ui';
import { accountService } from '../../services/account.service';

interface IFormValues {
  password: string;
}

export const DeleteAccountForm = () => {
  const navigate = useNavigate();
  const [submitResults, setSubmitResults] = useState<SubmitResults | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingPassword, setPendingPassword] = useState('');

  const formId = 'deleteAccount';

  const onSubmit = (values: IFormValues) => {
    setPendingPassword(values.password);
    setIsConfirmOpen(true);
  };

  const onConfirm = async () => {
    setIsConfirmOpen(false);

    try {
      const result = await accountService.deleteAccount(pendingPassword);

      if (!result.ok) {
        setSubmitResults({
          type: 'error',
          message: result.statusText || 'Oops, something went wrong!',
        });
        return;
      }

      navigate('/');
    } catch {
      setSubmitResults({
        type: 'error',
        message: 'Oops, something went wrong!',
      });
    }
  };

  return (
    <Flex data-cy="deleteAccountContainer" sx={{ flexDirection: 'column', gap: 2 }}>
      <UserContactError submitResults={submitResults} />

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
        message="Are you sure you want to permanently delete your account? This action cannot be undone and all your data will be lost."
        confirmButtonText="Delete my account"
        handleCancel={() => setIsConfirmOpen(false)}
        handleConfirm={onConfirm}
        confirmVariant="destructive"
      />
    </Flex>
  );
};
