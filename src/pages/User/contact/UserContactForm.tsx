import { observer } from 'mobx-react';
import { Button } from 'oa-components';
import type { Profile } from 'oa-shared';
import { useState } from 'react';
import { Form } from 'react-final-form';
import {
  UserContactError,
  UserContactFieldMessage,
  UserContactFieldName,
} from 'src/pages/User/contact';
import { contact } from 'src/pages/User/labels';
import { messageService } from 'src/services/messageService';
import { isUserContactable } from 'src/utils/helpers';
import { Box, Flex, Heading } from 'theme-ui';

interface Props {
  user: Profile;
}

type SubmitResults = { type: 'success' | 'error'; message: string };

export const UserContactForm = observer(({ user }: Props) => {
  if (!isUserContactable(user)) {
    return null;
  }

  const [submitResults, setSubmitResults] = useState<SubmitResults | null>(null);

  const buttonName = 'contact-submit';
  const formId = 'contact-form';

  const onSubmit = async (formValues, form) => {
    setSubmitResults(null);
    try {
      await messageService.sendMessage({
        to: user.username,
        message: formValues.message,
        name: formValues.name,
      });

      form.restart();
      return setSubmitResults({ type: 'success', message: contact.successMessage });
    } catch (error) {
      if (error.message) {
        setSubmitResults({ type: 'error', message: error.message });
      }
    }
  };

  return (
    <Flex sx={{ flexDirection: 'column' }} data-cy="UserContactForm">
      <Heading as="h3" variant="small" mb={2}>
        {`${contact.title} ${user.displayName}`}
      </Heading>
      <Form
        onSubmit={onSubmit}
        id={formId}
        validateOnBlur
        render={({ handleSubmit, submitting }) => {
          return (
            <form>
              <Flex sx={{ flexDirection: 'column', gap: 3 }}>
                <UserContactError submitResults={submitResults} />
                <UserContactFieldName />
                <UserContactFieldMessage />

                <Box sx={{ flexSelf: 'flex-start' }}>
                  <Button
                    onClick={handleSubmit}
                    data-cy={buttonName}
                    data-testid={buttonName}
                    variant="primary"
                    type="submit"
                    disabled={submitting}
                    form={formId}
                  >
                    {contact.button}
                  </Button>
                </Box>
              </Flex>
            </form>
          );
        }}
      />
    </Flex>
  );
});
