import { useEffect, useState } from 'react'
import { Form } from 'react-final-form'
import { observer } from 'mobx-react'
import { Button } from 'oa-components'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { contact } from 'src/pages/User/labels'
import { isUserContactable } from 'src/utils/helpers'
import { Box, Flex, Heading } from 'theme-ui'

import {
  UserContactError,
  UserContactFieldEmail,
  UserContactFieldMessage,
  UserContactFieldName,
  UserContactNotLoggedIn,
} from './'

import type { IUser } from 'src/models'

interface Props {
  user: IUser
}

type SubmitResults = { type: 'success' | 'error'; message: string }

export const UserContactForm = observer(({ user }: Props) => {
  if (!isUserContactable(user)) return null

  const { stores } = useCommonStores()
  const { userStore } = stores

  if (!userStore.activeUser)
    return <UserContactNotLoggedIn userName={user.userName} />

  const [submitResults, setSubmitResults] = useState<SubmitResults | null>(null)
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserEmail = async () => {
      return await userStore.getUserEmail()
    }
    fetchUserEmail().then((newEmail) => setEmail(newEmail))
  }, [email])

  const { button, title, successMessage } = contact
  const buttonName = 'contact-submit'
  const formId = 'contact-form'

  const onSubmit = async (formValues, form) => {
    setSubmitResults(null)
    const values = {
      toUserName: user.userName,
      text: formValues.message,
      ...formValues,
    }

    if (email) {
      try {
        await stores.messageStore.upload(values)
        setSubmitResults({ type: 'success', message: successMessage })
        form.restart()
      } catch (error) {
        setSubmitResults({ type: 'error', message: error.message })
      }
    }
  }

  return (
    <Flex my={2} sx={{ flexDirection: 'column' }}>
      <Heading variant="small" my={2}>
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
              <UserContactFieldEmail email={email} />
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
