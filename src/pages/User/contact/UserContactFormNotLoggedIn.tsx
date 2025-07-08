import { Form } from 'react-final-form'
import { useNavigate } from '@remix-run/react'
import { observer } from 'mobx-react'
import { Button } from 'oa-components'
import {
  UserContactFieldMessage,
  UserContactFieldName,
} from 'src/pages/User/contact'
import { contact } from 'src/pages/User/labels'
import { contactFormStyles } from 'src/styles/userContactFormNotLoggedIn'
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
  const isUserLoggedOut = true

  return (
    <Box sx={{ position: 'relative' }}>
      <Box sx={contactFormStyles.blurOverlay} />
      <Box sx={contactFormStyles.overlayContent}>
        <Flex sx={{ gap: 4, alignItems: 'center' }}>
          <Button
            variant="primary"
            sx={contactFormStyles.button}
            onClick={() => navigate('/sign-up')}
          >
            Register
          </Button>
          or
          <Button
            variant="secondary"
            sx={contactFormStyles.button}
            onClick={() => navigate('/sign-in')}
          >
            Log In
          </Button>
        </Flex>
        <Heading
          as="h4"
          mb={3}
          mt={2}
          sx={{
            color: 'black',
            px: 3,
            py: 1,
            borderRadius: 4,
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
                      disabled={isUserLoggedOut}
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
