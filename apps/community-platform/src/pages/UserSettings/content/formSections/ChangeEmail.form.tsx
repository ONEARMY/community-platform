import { useEffect, useState } from 'react'
import { Field, Form } from 'react-final-form'
import { Button, FieldInput, Icon } from '@onearmy.apps/components'
import { Flex, Heading, Text } from 'theme-ui'

import { PasswordField } from '../../../../common/Form/PasswordField'
import { useCommonStores } from '../../../../common/hooks/useCommonStores'
import { FormFieldWrapper } from '../../../../pages/Howto/Content/Common'
import { UserContactError } from '../../../../pages/User/contact/UserContactError'
import {
  buttons,
  fields,
  headings,
} from '../../../../pages/UserSettings/labels'

import type { SubmitResults } from '../../../../pages/User/contact/UserContactError'

interface IFormValues {
  password: string
  newEmail: string
}

export const ChangeEmailForm = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const [submitResults, setSubmitResults] = useState<SubmitResults | null>(null)
  const [currentEmail, setCurrentEmail] = useState<string | null>(null)

  const { userStore } = useCommonStores().stores
  const formId = 'changeEmail'
  const glyph = isExpanded ? 'arrow-full-up' : 'arrow-full-down'

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
      setIsExpanded(false)
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

      {isExpanded && currentEmail && (
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
                <Heading as="h3" variant="small">
                  {headings.changeEmail}
                </Heading>

                <Text sx={{ fontSize: 1 }}>
                  {fields.email.title}: <strong>{currentEmail}</strong>
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
