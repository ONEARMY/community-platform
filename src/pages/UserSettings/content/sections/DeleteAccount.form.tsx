import { Accordion, Button, FieldInput } from 'oa-components';
import { useState } from 'react';
import { Form } from 'react-final-form';
import { PasswordField } from 'src/common/Form/PasswordField';
import { FormFieldWrapper } from 'src/pages/common/FormFields';
import type { SubmitResults } from 'src/pages/User/contact/UserContactError';
import { UserContactError } from 'src/pages/User/contact/UserContactError';
import { buttons, fields } from 'src/pages/UserSettings/labels';
import { Flex, Text } from 'theme-ui';
import { accountService } from '../../services/account.service';

interface IFormValues {
  password: string;
}

export const DeleteAccountForm = () => {
  const [submitResults, setSubmitResults] = useState<SubmitResults | null>(null);

  const formId = 'deleteAccount';

  const onSubmit = async (values: IFormValues) => {
    try {
      const result = await accountService.deleteAccount(values.password);

      if (!result.ok) {
        const data = await result.json();

        if (data.error) {
          setSubmitResults({ type: 'error', message: data.error });
        } else {
          setSubmitResults({
            type: 'error',
            message: 'Oops, something went wrong!',
          });
        }

        return;
      }

      window.location.assign('/');
    } catch (error) {
      setSubmitResults({ type: 'error', message: error.message });
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
              <Flex data-cy="deleteAccountForm" sx={{ flexDirection: 'column', gap: 1 }}>
                <Text variant="body" sx={{ color: 'red' }}>
                  This action is permanent and cannot be undone. Your profile, map pins, and
                  subscriptions will be deleted. Content you created will remain but will no longer
                  be linked to your account.
                </Text>

                <FormFieldWrapper text={fields.password.title} htmlFor="password" required>
                  <PasswordField
                    autoComplete="off"
                    component={FieldInput}
                    data-cy="password"
                    name="password"
                    placeholder="Enter your password"
                    required
                  />
                </FormFieldWrapper>

                <Button
                  data-cy="deleteAccountSubmit"
                  disabled={disabled}
                  form={formId}
                  onClick={handleSubmit}
                  type="submit"
                  sx={{
                    alignSelf: 'flex-start',
                    backgroundColor: 'red',
                    '&:hover': { backgroundColor: 'red' },
                  }}
                >
                  {buttons.deleteAccount}
                </Button>
              </Flex>
            );
          }}
        />
      </Accordion>
    </Flex>
  );
};
