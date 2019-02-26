import * as React from 'react'
import { inject } from 'mobx-react'
import { auth } from 'src/utils/firebase'
import { Form, Field } from 'react-final-form'
import { Button } from 'src/components/Button'
import { InputField } from 'src/components/Form/Fields'
import { UserStore } from 'src/stores/User/user.store'
import queryString from 'query-string'
import { withRouter } from 'react-router-dom'
import { loginFormSubmit } from 'src/utils/user-migration'

interface IState {
  verifyMode: boolean
  userVerified: boolean
  error: any
}

interface IFormValues {
  email: string
  password: string
}

interface InjectedProps {
  userStore: UserStore
}

@(withRouter as any)
@inject('userStore')
export class EmailConfirmation extends React.Component<any, IState> {
  handlerMode: string = 'verifyEmail'
  formValues: IFormValues = {
    email: '',
    password: '',
  }

  public state: IState = {
    verifyMode: false,
    userVerified: false,
    error: null,
  }

  get injected() {
    return this.props as InjectedProps
  }

  public componentDidMount() {
    const values = queryString.parse(this.props.location.search)
    if (values.mode === this.handlerMode && !this.state.userVerified) {
      console.log(values)
      this.handleVerifyEmail(auth, values.oobCode);
      this.setState({ verifyMode: true });
    }
  }

  public async handleVerifyEmail(auth, actionCode) {
    try {
      await auth.applyActionCode(actionCode);
      console.log('User verified')
    } catch(error) {
      console.log('error: ', error.message);
      this.setState({ error: error.message });
    }
  }

  public async onSubmit(values) {
    await loginFormSubmit(values.email, values.password);
    this.props.userStore.sendEmailVerification()
  }

  public render() {
    return (
      this.state.verifyMode ? (
        !this.state.error ?
          'Account verified successfully. You can now login.'
        :
          this.state.error
        )
      :
        <Form
          onSubmit={values => this.onSubmit(values)}
          initialValues={this.formValues}
          render={({ handleSubmit, submitting, invalid }) => {
            return (
              <form onSubmit={handleSubmit}>
                <Field
                  name="email"
                  component={InputField}
                  label="Resend confirmation email on following address"
                  type="email"
                  required
                />
                <Field
                  name="password"
                  component={InputField}
                  label="Provided password"
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
      )
  }
}
