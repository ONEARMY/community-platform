import React, { useState } from 'react'
import { Form } from 'react-final-form'
import { Text, Flex, Label } from 'theme-ui'
import { Button, FieldInput } from 'oa-components'

import { PasswordField } from 'src/common/Form/PasswordField'
import { buttons, fields } from 'src/pages/UserSettings/labels'
import { useCommonStores } from 'src/index'

interface IFormValues {
  oldPassword?: string
  newPassword?: string
  repeatPassword?: string
}
interface IState {
  errorMsg?: string
  msg?: string
  showChangePasswordForm?: boolean
  formValues: IFormValues
}

export const ChangePasswordForm = () => {
  const { userStore } = useCommonStores().stores
  const [state, setState] = useState<IState>({ formValues: {} })
  const _labelStyle = { fontSize: 2, mb: 2 }

  const submit = async (values: IFormValues) => {
    const { oldPassword, newPassword } = values
    if (oldPassword && newPassword) {
      try {
        await userStore.changeUserPassword(oldPassword, newPassword)
        setState({
          msg: 'Password changed',
          formValues: {},
          errorMsg: undefined,
          showChangePasswordForm: false,
        })
      } catch (error) {
        setState({ errorMsg: error.message, formValues: {} })
      }
    }
  }

  return (
    <>
      <Button
        my={3}
        mr={2}
        variant={'secondary'}
        onClick={() =>
          setState((state) => ({
            ...state,
            showChangePasswordForm: !state.showChangePasswordForm,
          }))
        }
      >
        {buttons.changePassword}
      </Button>
      {state.showChangePasswordForm && (
        <Form
          onSubmit={(values) => submit(values as IFormValues)}
          initialValues={state.formValues}
          render={({ submitting, values, handleSubmit }) => {
            const { oldPassword, newPassword, repeatPassword } = values
            const disabled =
              submitting ||
              !oldPassword ||
              !newPassword ||
              repeatPassword !== newPassword ||
              oldPassword === newPassword
            return (
              <form onSubmit={handleSubmit}>
                <Flex sx={{ flexDirection: 'column' }} mb={3}>
                  <Label htmlFor="oldPassword" sx={_labelStyle}>
                    {fields.oldPassword.title} :
                  </Label>
                  <PasswordField
                    name="oldPassword"
                    component={FieldInput}
                    placeholder="Old password"
                    autocomplete="off"
                    required
                  />
                </Flex>
                <Flex sx={{ flexDirection: 'column' }} mb={3}>
                  <Label htmlFor="newPassword" sx={_labelStyle}>
                    {fields.newPassword.title} :
                  </Label>
                  <PasswordField
                    name="newPassword"
                    component={FieldInput}
                    placeholder="New password"
                    autocomplete="off"
                    required
                  />
                </Flex>
                <Flex sx={{ flexDirection: 'column' }} mb={3}>
                  <Label htmlFor="repeatPassword" sx={_labelStyle}>
                    {fields.repeatPassword.title} :
                  </Label>
                  <PasswordField
                    name="repeatPassword"
                    component={FieldInput}
                    placeholder="Repeat new password"
                    autocomplete="off"
                    required
                  />
                </Flex>
                <Button
                  type="submit"
                  disabled={disabled}
                  variant={disabled ? 'primary' : 'primary'}
                >
                  {buttons.submit}
                </Button>

                <Text color="error">{state.errorMsg}</Text>
              </form>
            )
          }}
        />
      )}
      <Text>{state.msg}</Text>
    </>
  )
}
