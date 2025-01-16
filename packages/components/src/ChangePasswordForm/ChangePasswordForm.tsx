import { useState } from 'react'
import { Form } from 'react-final-form'
import { Button, FieldInput, Icon } from 'oa-components'
import { Flex, Heading } from 'theme-ui'

import { PasswordField } from '../../../../src/common/Form/PasswordField'
import { useCommonStores } from '../../../../src/common/hooks/useCommonStores'
import { FormFieldWrapper } from '../../../../src/pages/Library/Content/Common'
import { UserContactError } from '../../../../src/pages/User/contact/UserContactError'
import {
  buttons,
  fields,
  headings,
} from '../../../../src/pages/UserSettings/labels'

import type { SubmitResults } from '../../../../src/pages/User/contact/UserContactError'

interface IFormValues {
  oldPassword: string
  newPassword: string
  repeatNewPassword: string
}

export const ChangePasswordForm = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const [submitResults, setSubmitResults] = useState<SubmitResults | null>(null)

  const { userStore } = useCommonStores().stores
  const formId = 'changePassword'
  const glyph = isExpanded ? 'arrow-full-up' : 'arrow-full-down'

  const onSubmit = async (values: IFormValues) => {
    const { oldPassword, newPassword } = values

    try {
      await userStore.changeUserPassword(oldPassword, newPassword)
      setSubmitResults({
        type: 'success',
        message: `Password changed.`,
      })
      setIsExpanded(false)
    } catch (error) {
      setSubmitResults({ type: 'error', message: error.message })
    }
  }

  return (
    <Flex
      data-cy="changePasswordContainer"
      sx={{ flexDirection: 'column', gap: 2 }}
    >
      <UserContactError submitResults={submitResults} />

      <Flex
        data-cy="changePasswordHeadingContainer"
        sx={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          userSelect: 'none',
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Heading as="h3" variant="small">
          {headings.changePassword}
        </Heading>
        <Icon glyph={glyph} />
      </Flex>

      {isExpanded && (
        <Form
          onSubmit={onSubmit}
          id={formId}
          render={({ handleSubmit, submitting, values }) => {
            const { oldPassword, newPassword, repeatNewPassword } = values
            const disabled =
              submitting ||
              !oldPassword ||
              !newPassword ||
              repeatNewPassword !== newPassword ||
              oldPassword === newPassword

            return (
              <Flex
                data-cy="changePasswordForm"
                sx={{ flexDirection: 'column', gap: 1 }}
              >
                <FormFieldWrapper
                  text={fields.oldPassword.title}
                  htmlFor="oldPassword"
                  required
                >
                  <PasswordField
                    autoComplete="off"
                    component={FieldInput}
                    data-cy="oldPassword"
                    name="oldPassword"
                    placeholder={fields.oldPassword.placeholder}
                    required
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  text={fields.newPassword.title}
                  htmlFor="newPassword"
                  required
                >
                  <PasswordField
                    autoComplete="off"
                    component={FieldInput}
                    data-cy="newPassword"
                    name="newPassword"
                    placeholder={fields.newPassword.placeholder}
                    required
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  text={fields.repeatNewPassword.title}
                  htmlFor="repeatNewPassword"
                  required
                >
                  <PasswordField
                    autoComplete="off"
                    component={FieldInput}
                    data-cy="repeatNewPassword"
                    name="repeatNewPassword"
                    placeholder={fields.repeatNewPassword.placeholder}
                    required
                  />
                </FormFieldWrapper>

                <Button
                  data-cy="changePasswordSubmit"
                  disabled={disabled}
                  form={formId}
                  onClick={handleSubmit}
                  type="submit"
                  sx={{
                    alignSelf: 'flex-start',
                  }}
                >
                  {buttons.submitNewPassword}
                </Button>
              </Flex>
            )
          }}
        />
      )}
    </Flex>
  )
}
