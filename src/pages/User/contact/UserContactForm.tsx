import { observer } from 'mobx-react';
import type { Profile } from 'oa-shared';
import { Form } from 'react-final-form';
import { useToast } from 'src/common/Toast';
import { UserContactFieldMessage } from 'src/pages/User/contact';
import { contact } from 'src/pages/User/labels';
import { messageService } from 'src/services/messageService';
import { isUserContactable } from 'src/utils/helpers';
import { Button } from '@/components/ui/button';
import SendIcon from '@/components/ui/icons/send.svg?react';

interface Props {
  user: Profile;
}

export const UserContactForm = observer(({ user }: Props) => {
  const toast = useToast();

  if (!isUserContactable(user)) {
    return null;
  }

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
    <Form
      onSubmit={onSubmit}
      validateOnBlur
      render={({ handleSubmit, submitting }) => (
        <form onSubmit={handleSubmit} data-cy="UserContactForm" className="flex flex-col gap-3">
          <UserContactFieldMessage />
          <Button
            type="submit"
            size="sm"
            disabled={submitting}
            data-cy="contact-submit"
            data-testid="contact-submit"
            className="self-start"
          >
            <SendIcon data-icon="inline-start" aria-hidden="true" />
            {contact.button}
          </Button>
        </form>
      )}
    />
  );
});
