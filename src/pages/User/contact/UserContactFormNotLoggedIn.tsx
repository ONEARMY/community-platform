import { Form } from 'react-final-form'
import { useNavigate } from '@remix-run/react'
import { observer } from 'mobx-react'
import { Button } from 'oa-components'
import {
  UserContactFieldMessage,
  UserContactFieldName,
} from 'src/pages/User/contact'
import { contact } from 'src/pages/User/labels'
import { isUserContactable } from 'src/utils/helpers'
import { Box, Flex, Heading } from 'theme-ui'

import type { IUser } from 'oa-shared'

interface Props {
  user: IUser
}

export const UserContactFormNotLoggedIn = observer(({ user }: Props) => {
  const navigate = useNavigate()

  if (!isUserContactable(user)) {
    return null
  }

  const { button, title } = contact
  const buttonName = 'contact-submit'
  const formId = 'contact-form'

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
          <Button
            variant="primary"
            sx={{
              px: 4,
              py: 2,
              borderRadius: 2,
              minWidth: '100px',
              fontWeight: 'bold',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => navigate('/sign-up')}
          >
            Register
          </Button>
          or
          <Button
            variant="secondary"
            sx={{
              px: 4,
              py: 2,
              borderRadius: 2,
              minWidth: '100px',
              fontWeight: 'bold',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => navigate('/sign-in')}
          >
            Log In
          </Button>
        </Flex>
        <Heading
          as="h4"
          sx={{
            color: 'black',
            px: 3,
            py: 1,
            borderRadius: 4,
            marginY: 3,
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
                  <UserContactFieldName isUserLoggedOut />
                  <UserContactFieldMessage isUserLoggedOut />

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
            )
          }}
        />
      </Flex>
    </Box>
  )
})
