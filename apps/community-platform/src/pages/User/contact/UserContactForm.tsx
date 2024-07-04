import { useState } from 'react'
import { Form } from 'react-final-form'
import { Button } from '@onearmy.apps/components'
import { observer } from 'mobx-react'
import { Box, Flex, Heading } from 'theme-ui'

import { useCommonStores } from '../../../common/hooks/useCommonStores'
import {
  UserContactError,
  UserContactFieldMessage,
  UserContactFieldName,
  UserContactNotLoggedIn,
} from '../../../pages/User/contact'
import { contact } from '../../../pages/User/labels'
import { messageService } from '../../../services/message.service'
import { isUserContactable } from '../../../utils/helpers'

import type { IUser } from '../../../models'

interface Props {
  user: IUser
}

type SubmitResults = { type: 'success' | 'error'; message: string }

export const UserContactForm = observer(({ user }: Props) => {
  if (!isUserContactable(user)) return null

  const { userStore } = useCommonStores().stores

  if (!userStore.activeUser)
    return <UserContactNotLoggedIn userName={user.userName} />

  const [submitResults, setSubmitResults] = useState<SubmitResults | null>(null)

  const { button, title, successMessage } = contact
  const buttonName = 'contact-submit'
  const formId = 'contact-form'

  const onSubmit = async (formValues, form) => {
    setSubmitResults(null)
    try {
      await messageService.sendMessage({
        to: user.userName,
        message: formValues.message,
        name: formValues.name,
      })
      setSubmitResults({ type: 'success', message: successMessage })
      form.restart()
    } catch (error) {
      setSubmitResults({ type: 'error', message: error.message })
    }
  }

  return (
    <Flex my={2} sx={{ flexDirection: 'column' }}>
      <Heading as="h3" variant="small" my={2}>
        {`${title} ${user.userName}`}
      </Heading>
      <Form
        onSubmit={onSubmit}
        id={formId}
        validateOnBlur
        render={({ handleSubmit, submitting }) => {
          return (
            <form>
              <UserContactError submitResults={submitResults} />

              <UserContactFieldName />
              <UserContactFieldMessage />

              <Box>
                <Button
                  large
                  onClick={handleSubmit}
                  data-cy={buttonName}
                  data-testid={buttonName}
                  mt={3}
                  variant="primary"
                  type="submit"
                  disabled={submitting}
                  form={formId}
                >
                  {button}
                </Button>
              </Box>
            </form>
          )
        }}
      />
    </Flex>
  )
})
