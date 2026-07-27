import { Accordion, Button, FieldInput } from 'oa-components';
import { FRIENDLY_MESSAGES } from 'oa-shared';
import { useContext } from 'react';
import { Field, Form } from 'react-final-form';
import { PasswordField } from 'src/common/Form/PasswordField';
import { useToast } from 'src/common/Toast/useToast';
import { FormFieldWrapper } from 'src/pages/common/FormFields';
import { SessionContext } from 'src/pages/common/SessionContext';
import { buttons, fields } from 'src/pages/UserSettings/labels';
import { Flex } from 'theme-ui';
import { accountService } from '../../services/account.service';

interface IFormValues {
  password: string;
  newEmail: string;
}

export const ChangeEmailForm = () => {
  const claims = useContext(SessionContext);
  const toast = useToast();

  const formId = 'changeEmail';

  const onSubmit = async (values: IFormValues) => {
    const { newEmail, password } = values;
    const promise = accountService.changeEmail(newEmail, password);

    toast.promise(promise, {
      loading: 'Changing your email...',
      success: () => FRIENDLY_MESSAGES['auth/email-changed'],
      error: (error) => `Error: ${error.message}`,
    });
  };

  return (
    <Flex data-cy="changeEmailContainer" sx={{ flexDirection: 'column', gap: 2 }}>
      <Accordion title="Change Email" subtitle={`${fields.email.title}: ${claims?.email}`}>
        <Form
          onSubmit={onSubmit}
          id={formId}
          render={({ handleSubmit, submitting, values }) => {
            const { password, newEmail } = values;
            const disabled = submitting || !password || !newEmail || newEmail === claims?.email;

            return (
              <Flex data-cy="changeEmailForm" sx={{ flexDirection: 'column', gap: 2 }}>
                <FormFieldWrapper text={fields.newEmail.title} htmlFor="newEmail" required>
                  <Field
                    autoComplete="off"
                    component={FieldInput}
                    data-cy="newEmail"
                    name="newEmail"
                    placeholder={fields.newEmail.placeholder}
                    type="email"
                    required
                  />
                </FormFieldWrapper>

                <FormFieldWrapper text={fields.password.title} htmlFor="password" required>
                  <PasswordField
                    autoComplete="off"
                    component={FieldInput}
                    data-cy="password"
                    name="password"
                    required
                    placeholder="Password"
                  />
                </FormFieldWrapper>

                <Button
                  data-cy="changeEmailSubmit"
                  disabled={disabled}
                  form={formId}
                  onClick={handleSubmit}
                  type="submit"
                  sx={{
                    alignSelf: 'flex-start',
                  }}
                >
                  {buttons.submitNewEmail}
                </Button>
              </Flex>
            );
          }}
        />
      </Accordion>
    </Flex>
  );
};
