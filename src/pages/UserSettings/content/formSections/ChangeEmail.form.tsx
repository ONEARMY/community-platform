import * as React from 'react'
import { Field, Form } from 'react-final-form'
import { Text, Flex, Label } from 'theme-ui'
import { Button, FieldInput } from 'oa-components'

import { PasswordField } from 'src/common/Form/PasswordField'
import { buttons, fields } from 'src/pages/UserSettings/labels'

import type { UserStore } from 'src/stores/User/user.store'

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
interface IProps {
  userStore: UserStore
}

export class ChangeEmailForm extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = { formValues: {} }
    this.getUserEmail()
  }

  public async submit(values: IFormValues) {
    const { password, newEmail } = values
    if (password && newEmail) {
      try {
        await this.props.userStore.changeUserEmail(password, newEmail)
        this.setState({
          msg: 'Email changed',
          formValues: {},
          errorMsg: undefined,
          showChangeEmailForm: false,
        })
        this.getUserEmail()
      } catch (error) {
        this.setState({ errorMsg: error.message, formValues: {} })
      }
    }
  }

  public async getUserEmail() {
    const email = await this.props.userStore.getUserEmail()
    this.setState({ email: email })
  }

  public render() {
    const _labelStyle = { fontSize: 2, mb: 2 }
    return (
      <>
        <Button
          my={3}
          mr={2}
          variant={'secondary'}
          onClick={() =>
            this.setState({
              showChangeEmailForm: !this.state.showChangeEmailForm,
            })
          }
        >
          {buttons.changeEmail}
        </Button>
        {this.state.showChangeEmailForm && (
          <Form
            onSubmit={(values) => this.submit(values as IFormValues)}
            initialValues={this.state.formValues}
            render={({ submitting, values, handleSubmit }) => {
              const { password, newEmail } = values
              const disabled =
                submitting ||
                !password ||
                !newEmail ||
                newEmail === this.state.email
              return (
                <form onSubmit={handleSubmit}>
                  <Flex sx={{ flexDirection: 'column' }} mb={3}>
                    <Text>
                      {fields.email.title}: {this.state.email}
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
                  <Text color="error">{this.state.errorMsg}</Text>
                </form>
              )
            }}
          />
        )}
        <Text>{this.state.msg}</Text>
      </>
    )
  }
}
