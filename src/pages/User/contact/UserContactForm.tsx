import { useState } from 'react'
import { Form } from 'react-final-form'
import { Box, Flex, Heading } from 'theme-ui'
import { Button } from 'oa-components'
import { observer } from 'mobx-react'

import { useCommonStores } from 'src/index'
import { contact } from 'src/pages/User/labels'
import {
  UserContactError,
  UserContactFieldEmail,
  UserContactFieldMessage,
  UserContactFieldName,
} from './'

import type { IUser } from 'src/models'

interface Props {
  user: IUser
}

type SubmitResults = { type: 'success' | 'error'; message: string }

export const UserContactForm = observer(({ user }: Props) => {
  if (!user.isContactableByPublic) return null

  const [submitResults, setSubmitResults] = useState<SubmitResults | null>(null)

  const { button, title, successMessage } = contact
  const buttonName = 'contact-submit'
  const formId = 'contact-form'
  const { stores } = useCommonStores()

  const onSubmit = async (formValues, form) => {
    setSubmitResults(null)
    const values = {
      toUserName: user.userName,
      text: formValues.message,
      ...formValues,
    }

    try {
      await stores.messageStore.upload(values)
      setSubmitResults({ type: 'success', message: successMessage })
      form.restart()
    } catch (error) {
      setSubmitResults({ type: 'error', message: error.message })
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
              <UserContactFieldEmail />
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
