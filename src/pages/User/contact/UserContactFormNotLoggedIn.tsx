import { observer } from 'mobx-react';
import { Button } from 'oa-components';
import type { Profile } from 'oa-shared';
import { Form } from 'react-final-form';
import { useNavigate } from 'react-router';
import { UserContactFieldMessage, UserContactFieldName } from 'src/pages/User/contact';
import { contact } from 'src/pages/User/labels';
import { isUserContactable } from 'src/utils/helpers';
import { Box, Flex, Heading } from 'theme-ui';

interface Props {
  user: Profile;
}

export const UserContactFormNotLoggedIn = observer(({ user }: Props) => {
  const navigate = useNavigate();

  if (!isUserContactable(user)) {
    return null;
  }

  const { button, title } = contact;
  const buttonName = 'contact-submit';
  const formId = 'contact-form';

  return (
    <Box sx={{ position: 'relative' }}>
      <Box
        sx={{
          position: 'absolute',
          inset: -1,
          zIndex: 10,
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          backgroundColor: 'rgba(160, 160, 160, 0.4)',
          pointerEvents: 'auto',
          borderRadius: 2,
          border: '2px solid black',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          pointerEvents: 'auto',
        }}
      >
        <Flex sx={{ gap: 4, alignItems: 'center' }}>
          <Button variant="primary" onClick={() => navigate('/sign-up')}>
            Register
          </Button>
          or
          <Button variant="secondary" onClick={() => navigate('/sign-in')}>
            Log In
          </Button>
        </Flex>
        <Heading
          as="h4"
          sx={{
            padding: 3,
          }}
        >
          To send a message.
        </Heading>
      </Box>
      <Flex
        sx={{ flexDirection: 'column', margin: 30, pointerEvents: 'none' }}
        data-cy="UserContactNotLoggedIn"
      >
        <Heading as="h3" variant="small" my={2}>
          {`${title} ${user.displayName}`}
        </Heading>
        <Form
          onSubmit={() => {}}
          id={formId}
          validateOnBlur
          render={() => {
            return (
              <form>
                <Flex sx={{ flexDirection: 'column', gap: 2 }}>
                  <UserContactFieldName />
                  <UserContactFieldMessage />

                  <Box sx={{ flexSelf: 'flex-start' }}>
                    <Button
                      large
                      data-cy={buttonName}
                      data-testid={buttonName}
                      variant="primary"
                      type="submit"
                      form={formId}
                    >
                      {button}
                    </Button>
                  </Box>
                </Flex>
              </form>
            );
          }}
        />
      </Flex>
    </Box>
  );
});
