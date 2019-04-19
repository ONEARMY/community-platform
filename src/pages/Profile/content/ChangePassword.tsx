import * as React from 'react'
import { EmailAuthProvider } from 'src/utils/firebase'
import { Form, Field } from 'react-final-form'
import { Button } from 'src/components/Button'
import { InputField } from 'src/components/Form/Fields'
import { UserStore } from 'src/stores/User/user.store'
import { RouteComponentProps } from 'react-router'

interface IChangePasswordForm {
  password: string
  newPassword: string
  repeatPassword: string
}

interface IState {
  error?: any
}
interface IProps extends RouteComponentProps {
  userStore: UserStore
}

export class ChangePasswordPage extends React.Component<IProps, IState> {
  public state: IState = {
    error: null,
  }

  public formValues: IChangePasswordForm = {
    password: '',
    newPassword: '',
    repeatPassword: '',
  }

  public onSubmit = async (formValues: IChangePasswordForm) => {
    const { password, newPassword, repeatPassword } = formValues
    try {
      const user = this.props.userStore.authUser as firebase.User
      const credentials = EmailAuthProvider.credential(
        user.email as string,
        password,
      )
      await user.reauthenticateAndRetrieveDataWithCredential(credentials)
      if (newPassword === repeatPassword) {
        await user.updatePassword(formValues.newPassword)
        this.props.history.push('/profile')
      } else {
        throw new Error('Passwords does not match')
      }
    } catch (error) {
      this.setState({ error: error.message ? error.message : error })
    }
  }

  public render() {
    return (
      <div>
        {this.state.error ? this.state.error : null}
        <Form
          onSubmit={values => this.onSubmit(values as IChangePasswordForm)}
          initialValues={this.formValues}
          render={({ handleSubmit, submitting, invalid }) => {
            return (
              <form onSubmit={handleSubmit}>
                <Field
                  name="password"
                  component={InputField}
                  label="Old password"
                  type="password"
                  required
                />
                <Field
                  name="newPassword"
                  component={InputField}
                  label="New password"
                  type="password"
                  required
                />
                <Field
                  name="repeatPassword"
                  component={InputField}
                  label="Repeat new password"
                  type="password"
                  required
                />
                <Button
                  type="submit"
                  icon={'check'}
                  disabled={submitting || invalid}
                >
                  Submit
                </Button>
              </form>
            )
          }}
        />
      </div>
    )
  }
}
