import { Accordion, Button, FieldInput } from 'oa-components';
import { FRIENDLY_MESSAGES } from 'oa-shared';
import { Form } from 'react-final-form';
import { PasswordField } from 'src/common/Form/PasswordField';
import { useToast } from 'src/common/Toast/useToast';
import { FormFieldWrapper } from 'src/pages/common/FormFields';
import { buttons, fields } from 'src/pages/UserSettings/labels';
import { Flex } from 'theme-ui';
import { accountService } from '../../services/account.service';

interface IFormValues {
  oldPassword: string;
  newPassword: string;
  repeatNewPassword: string;
}

export const ChangePasswordForm = () => {
  const toast = useToast();
  const formId = 'changePassword';

  const onSubmit = async (values: IFormValues) => {
    const { oldPassword, newPassword } = values;

    const promise = accountService.changePassword(oldPassword, newPassword);

    toast.promise(promise, {
      loading: 'Changing your password...',
      success: () => FRIENDLY_MESSAGES['auth/password-changed'],
      error: (error) => `Error: ${error.message}`,
    });
  };

  return (
    <Flex data-cy="changePasswordContainer" sx={{ flexDirection: 'column', gap: 2 }}>
      <Accordion
        title="Change Password"
        subtitle="Here you can change your password to a stronger one."
      >
        <Form
          onSubmit={onSubmit}
          id={formId}
          render={({ handleSubmit, submitting, values }) => {
            const { oldPassword, newPassword, repeatNewPassword } = values;
            const disabled =
              submitting ||
              !oldPassword ||
              !newPassword ||
              repeatNewPassword !== newPassword ||
              oldPassword === newPassword;

            return (
              <Flex data-cy="changePasswordForm" sx={{ flexDirection: 'column', gap: 1 }}>
                <FormFieldWrapper text={fields.oldPassword.title} htmlFor="oldPassword" required>
                  <PasswordField
                    autoComplete="off"
                    component={FieldInput}
                    data-cy="oldPassword"
                    name="oldPassword"
                    placeholder={fields.oldPassword.placeholder}
                    required
                  />
                </FormFieldWrapper>

                <FormFieldWrapper text={fields.newPassword.title} htmlFor="newPassword" required>
                  <PasswordField
                    autoComplete="off"
                    component={FieldInput}
                    data-cy="newPassword"
                    name="newPassword"
                    placeholder={fields.newPassword.placeholder}
                    required
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  text={fields.repeatNewPassword.title}
                  htmlFor="repeatNewPassword"
                  required
                >
                  <PasswordField
                    autoComplete="off"
                    component={FieldInput}
                    data-cy="repeatNewPassword"
                    name="repeatNewPassword"
                    placeholder={fields.repeatNewPassword.placeholder}
                    required
                  />
                </FormFieldWrapper>

                <Button
                  data-cy="changePasswordSubmit"
                  disabled={disabled}
                  form={formId}
                  onClick={handleSubmit}
                  type="submit"
                  sx={{
                    alignSelf: 'flex-start',
                  }}
                >
                  {buttons.submitNewPassword}
                </Button>
              </Flex>
            );
          }}
        />
      </Accordion>
    </Flex>
  );
};
