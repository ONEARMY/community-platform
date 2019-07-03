import * as React from 'react'
import { Field, Form } from 'react-final-form'
import { Button } from 'src/components/Button'
import { InputField } from 'src/components/Form/Fields'
import { UserStore } from 'src/stores/User/user.store'
import Text from 'src/components/Text'
import { colors } from 'src/themes/styled.theme'

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
    return (
      <>
        <Button
          mt={3}
          variant={'outline'}
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
            onSubmit={values => this.submit(values as IFormValues)}
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
                  <Field
                    name="oldPassword"
                    component={InputField}
                    placeholder="Old password"
                    type="password"
                    autocomplete="off"
                    required
                  />
                  <Field
                    name="newPassword"
                    component={InputField}
                    placeholder="New password"
                    type="password"
                    autocomplete="off"
                    required
                  />
                  <Field
                    name="repeatPassword"
                    component={InputField}
                    placeholder="Repeat new password"
                    type="password"
                    autocomplete="off"
                    required
                  />
                  <Button
                    type="submit"
                    disabled={disabled}
                    variant={disabled ? 'disabled' : 'outline'}
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
