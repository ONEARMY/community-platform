import { useContext, useState } from 'react'
import { Field, Form } from 'react-final-form'
import { Button, FieldInput, Icon } from 'oa-components'
import { PasswordField } from 'src/common/Form/PasswordField'
import { SessionContext } from 'src/pages/common/SessionContext'
import { FormFieldWrapper } from 'src/pages/Library/Content/Common'
import { UserContactError } from 'src/pages/User/contact/UserContactError'
import { buttons, fields, headings } from 'src/pages/UserSettings/labels'
import { Flex, Heading, Text } from 'theme-ui'

import type { SubmitResults } from 'src/pages/User/contact/UserContactError'

interface IFormValues {
  password: string
  newEmail: string
}

export const ChangeEmailForm = () => {
  const user = useContext(SessionContext)
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const [submitResults, setSubmitResults] = useState<SubmitResults | null>(null)

  const formId = 'changeEmail'
  const glyph = isExpanded ? 'arrow-full-up' : 'arrow-full-down'

  const onSubmit = async (values: IFormValues) => {
    const { password, newEmail } = values
    try {
      // TODO
      // await userStore.changeUserEmail(password, newEmail)
      setSubmitResults({
        type: 'success',
        message: `Email changed to ${newEmail}. You've been sent two emails now(!) One to your old email address to check this was you and the other to your new address to verify it.`,
      })
      setIsExpanded(false)
      getUserEmail()
    } catch (error) {
      setSubmitResults({ type: 'error', message: error.message })
    }
  }

  const getUserEmail = async () => {
    // TODO
    // const email = await userStore.getUserEmail()
  }

  return (
    <Flex
      data-cy="changeEmailContainer"
      sx={{ flexDirection: 'column', gap: 2 }}
    >
      <UserContactError submitResults={submitResults} />

      {isExpanded && (
        <Form
          onSubmit={onSubmit}
          id={formId}
          render={({ handleSubmit, submitting, values }) => {
            const { password, newEmail } = values
            const disabled =
              submitting || !password || !newEmail || newEmail === user?.email

            return (
              <Flex
                data-cy="changeEmailForm"
                sx={{ flexDirection: 'column', gap: 2 }}
              >
                <Heading as="h3" variant="small">
                  {headings.changeEmail}
                </Heading>

                <Text sx={{ fontSize: 1 }}>
                  {fields.email.title}: <strong>{user?.email}</strong>
                </Text>

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
      )}

      <Button
        type="button"
        data-cy="changeEmailButton"
        onClick={() => setIsExpanded(!isExpanded)}
        variant="secondary"
        sx={{
          alignSelf: 'flex-start',
        }}
      >
        <Flex sx={{ gap: 2 }}>
          <Text>{buttons.changeEmail}</Text>
          <Icon glyph={glyph} />
        </Flex>
      </Button>
    </Flex>
  )
}
