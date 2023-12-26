import React, { useEffect, useState } from 'react'
import { Field, Form } from 'react-final-form'
import { Text, Flex, Label } from 'theme-ui'
import { Button, FieldInput } from 'oa-components'

import { PasswordField } from 'src/common/Form/PasswordField'
import { buttons, fields } from 'src/pages/UserSettings/labels'
import { useCommonStores } from 'src/index'

interface IFormValues {
  password?: string
  newEmail?: string
}
interface IState {
  errorMsg?: string
  msg?: string
  showChangeEmailForm?: boolean
  formValues: IFormValues
  email?: string
}
export const ChangeEmailForm = () => {
  const { userStore } = useCommonStores().stores
  const [state, setState] = useState<IState>({ formValues: {} })
  const _labelStyle = { fontSize: 2, mb: 2 }

  useEffect(() => {
    getUserEmail()
  }, [])

  const submit = async (values: IFormValues) => {
    const { password, newEmail } = values
    if (password && newEmail) {
      try {
        await userStore.changeUserEmail(password, newEmail)
        setState({
          msg: 'Email changed',
          formValues: {},
          errorMsg: undefined,
          showChangeEmailForm: false,
        })
        getUserEmail()
      } catch (error) {
        setState({ errorMsg: error.message, formValues: {} })
      }
    }
  }

  const getUserEmail = async () => {
    const email = await userStore.getUserEmail()
    setState((state) => ({ ...state, email: email }))
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
            showChangeEmailForm: !state.showChangeEmailForm,
          }))
        }
      >
        {buttons.changeEmail}
      </Button>
      {state.showChangeEmailForm && (
        <Form
          onSubmit={(values) => submit(values as IFormValues)}
          initialValues={state.formValues}
          render={({ submitting, values, handleSubmit }) => {
            const { password, newEmail } = values
            const disabled =
              submitting || !password || !newEmail || newEmail === state.email
            return (
              <form onSubmit={handleSubmit}>
                <Flex sx={{ flexDirection: 'column' }} mb={3}>
                  <Text>
                    {fields.email.title}: {state.email}
                  </Text>
                </Flex>
                <Flex sx={{ flexDirection: 'column' }} mb={3}>
                  <Label htmlFor="newEmail" sx={_labelStyle}>
                    {fields.newEmail.title} :
                  </Label>
                  <Field
                    name="newEmail"
                    component={FieldInput}
                    placeholder={fields.newEmail.placeholder}
                    type="email"
                    autocomplete="off"
                    required
                  />
                </Flex>
                <Flex sx={{ flexDirection: 'column' }} mb={3}>
                  <Label htmlFor="oldPassword" sx={_labelStyle}>
                    {fields.password.title} :
                  </Label>
                  <PasswordField
                    name="password"
                    component={FieldInput}
                    type="password"
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
