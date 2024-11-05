import { useState } from 'react'
import { Form } from 'react-final-form'
import { Button, ButtonIcon, FieldInput } from 'oa-components'
import { PasswordField } from 'src/common/Form/PasswordField'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { FormFieldWrapper } from 'src/pages/Howto/Content/Common'
import { UserContactError } from 'src/pages/User/contact/UserContactError'
import { buttons, fields, headings } from 'src/pages/UserSettings/labels'
import { Flex, Heading, Text } from 'theme-ui'

import type { SubmitResults } from 'src/pages/User/contact/UserContactError'

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
  const dropdownIcon = isExpanded ? 'chevron-up' : 'chevron-down'

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
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          ':hover': {
            cursor: 'pointer',
          },
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Heading as="h3" variant="small">
          {headings.changePassword}
        </Heading>
        <ButtonIcon
          data-cy="MapFilterList-CloseButton"
          icon={dropdownIcon}
          sx={{
            paddingRight: 3,
            paddingLeft: 2,
            border: 'none',
            ':hover': {
              backgroundColor: 'unset',
              cursor: 'pointer',
            },
          }}
        />
      </Flex>
      <Text sx={{ fontSize: 1 }}>
        Here you can change your password to be a stronger one. 💪
      </Text>
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
                sx={{ flexDirection: 'column', gap: 1, marginTop: 5 }}
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
