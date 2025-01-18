import { useEffect, useState } from 'react'
import { Field, Form } from 'react-final-form'
import { Accordion, Button, FieldInput } from 'oa-components'
import { PasswordField } from 'src/common/Form/PasswordField'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { FormFieldWrapper } from 'src/pages/common/FormFieldWrapper'
import { UserContactError } from 'src/pages/User/contact/UserContactError'
import { buttons, fields } from 'src/pages/UserSettings/labels'
import { Flex } from 'theme-ui'

import type { SubmitResults } from 'src/pages/User/contact/UserContactError'

interface IFormValues {
  password: string
  newEmail: string
}

export const ChangeEmailForm = () => {
  const [submitResults, setSubmitResults] = useState<SubmitResults | null>(null)
  const [currentEmail, setCurrentEmail] = useState<string | null>(null)

  const { userStore } = useCommonStores().stores
  const formId = 'changeEmail'

  useEffect(() => {
    getUserEmail()
  }, [])

  const onSubmit = async (values: IFormValues) => {
    const { password, newEmail } = values
    try {
      await userStore.changeUserEmail(password, newEmail)
      setSubmitResults({
        type: 'success',
        message: `Email changed to ${newEmail}. You've been sent two emails now(!) One to your old email address to check this was you and the other to your new address to verify it.`,
      })
      getUserEmail()
    } catch (error) {
      setSubmitResults({ type: 'error', message: error.message })
    }
  }

  const getUserEmail = async () => {
    const email = await userStore.getUserEmail()
    setCurrentEmail(email)
  }

  return (
    <Flex
      data-cy="changeEmailContainer"
      sx={{ flexDirection: 'column', gap: 2 }}
    >
      <UserContactError submitResults={submitResults} />
      <Accordion
        data-cy="changeEmailAccordion"
        title="Change Email"
        subtitle={`${fields.email.title}: ${currentEmail}`}
      >
        <Form
          onSubmit={onSubmit}
          id={formId}
          render={({ handleSubmit, submitting, values }) => {
            const { password, newEmail } = values
            const disabled =
              submitting || !password || !newEmail || newEmail === currentEmail

            return (
              <Flex
                data-cy="changeEmailForm"
                sx={{ flexDirection: 'column', gap: 2 }}
              >
                <FormFieldWrapper
                  text={fields.newEmail.title}
                  htmlFor="newEmail"
                  required
                >
                  <Field
                    autoComplete="off"
                    component={FieldInput}
                    data-cy="newEmail"
                    name="newEmail"
                    placeholder={fields.newEmail.placeholder}
                    type="email"
                    required
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  text={fields.password.title}
                  htmlFor="password"
                  required
                >
                  <PasswordField
                    autoComplete="off"
                    component={FieldInput}
                    data-cy="password"
                    name="password"
                    required
                    placeholder="Password"
                  />
                </FormFieldWrapper>

                <Button
                  data-cy="changeEmailSubmit"
                  disabled={disabled}
                  form={formId}
                  onClick={handleSubmit}
                  type="submit"
                  sx={{
                    alignSelf: 'flex-start',
                  }}
                >
                  {buttons.submitNewEmail}
                </Button>
              </Flex>
            )
          }}
        />
      </Accordion>
    </Flex>
  )
}
