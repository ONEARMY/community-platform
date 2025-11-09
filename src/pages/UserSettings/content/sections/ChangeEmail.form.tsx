import { useContext, useState } from 'react'
import { Field, Form } from 'react-final-form'
import { Accordion, Button, FieldInput } from 'oa-components'
import { FRIENDLY_MESSAGES } from 'oa-shared'
import { PasswordField } from 'src/common/Form/PasswordField'
import { FormFieldWrapper } from 'src/pages/common/FormFields'
import { SessionContext } from 'src/pages/common/SessionContext'
import { UserContactError } from 'src/pages/User/contact/UserContactError'
import { buttons, fields } from 'src/pages/UserSettings/labels'
import { Flex } from 'theme-ui'

import { accountService } from '../../services/account.service'

import type { SubmitResults } from 'src/pages/User/contact/UserContactError'

interface IFormValues {
  password: string
  newEmail: string
}

export const ChangeEmailForm = () => {
  const claims = useContext(SessionContext)
  const [submitResults, setSubmitResults] = useState<SubmitResults | null>(null)

  const formId = 'changeEmail'

  const onSubmit = async (values: IFormValues) => {
    const { newEmail, password } = values
    try {
      const result = await accountService.changeEmail(newEmail, password)

      if (!result.ok) {
        const data = await result.json()

        if (data.error) {
          setSubmitResults({ type: 'error', message: data.error })
        } else {
          setSubmitResults({
            type: 'error',
            message: 'Oops, something went wrong!',
          })
        }

        return
      }

      setSubmitResults({
        type: 'success',
        message: FRIENDLY_MESSAGES['auth/email-changed'],
      })
    } catch (error) {
      setSubmitResults({ type: 'error', message: error.message })
    }
  }

  return (
    <Flex
      data-cy="changeEmailContainer"
      sx={{ flexDirection: 'column', gap: 2 }}
    >
      <UserContactError submitResults={submitResults} />
      <Accordion
        title="Change Email"
        subtitle={`${fields.email.title}: ${claims?.email}`}
      >
        <Form
          onSubmit={onSubmit}
          id={formId}
          render={({ handleSubmit, submitting, values }) => {
            const { password, newEmail } = values
            const disabled =
              submitting || !password || !newEmail || newEmail === claims?.email

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
