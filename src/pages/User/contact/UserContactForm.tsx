import { observer } from 'mobx-react';
import { Button } from 'oa-components';
import type { Profile } from 'oa-shared';
import { Form } from 'react-final-form';
import { useToast } from 'src/common/Toast';
import { UserContactFieldMessage, UserContactFieldName } from 'src/pages/User/contact';
import { contact } from 'src/pages/User/labels';
import { messageService } from 'src/services/messageService';
import { isUserContactable } from 'src/utils/helpers';
import { Box, Flex, Heading } from 'theme-ui';

interface Props {
  user: Profile;
}

export const UserContactForm = observer(({ user }: Props) => {
  const toast = useToast();

  if (!isUserContactable(user)) {
    return null;
  }

  const buttonName = 'contact-submit';
  const formId = 'contact-form';

  const onSubmit = async (formValues, form) => {
    const promise = messageService.sendMessage({
      to: user.username!,
      message: formValues.message,
      name: formValues.name,
    });

    toast.promise(promise, {
      loading: 'Sending your message...',
      success: () => {
        form.restart();
        return contact.successMessage;
      },
      error: (error) => `Error: ${error.message}`,
    });
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
