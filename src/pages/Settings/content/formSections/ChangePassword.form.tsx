import * as React from 'react'
import { Form } from 'react-final-form'
import { Button, FieldInput } from 'oa-components'
import type { UserStore } from 'src/stores/User/user.store'
import { Text, Flex, Label } from 'theme-ui'
import { PasswordField } from 'src/common/Form/PasswordField'

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
interface IProps {
  userStore: UserStore
}

export class ChangePasswordForm extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = { formValues: {} }
  }

  public async submit(values: IFormValues) {
    const { oldPassword, newPassword } = values
    if (oldPassword && newPassword) {
      try {
        await this.props.userStore.changeUserPassword(oldPassword, newPassword)
        this.setState({
          msg: 'Password changed',
          formValues: {},
          errorMsg: undefined,
          showChangePasswordForm: false,
        })
      } catch (error) {
        this.setState({ errorMsg: error.message, formValues: {} })
      }
    }
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
              showChangePasswordForm: !this.state.showChangePasswordForm,
            })
          }
        >
          Change password
        </Button>
        {this.state.showChangePasswordForm && (
          <Form
            onSubmit={(values) => this.submit(values as IFormValues)}
            initialValues={this.state.formValues}
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
                      Old password :
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
                      New password :
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
                      Repeat new password :
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
                    Submit
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
