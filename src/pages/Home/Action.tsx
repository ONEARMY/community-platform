import * as React from 'react'
import { inject } from 'mobx-react'
import { Text } from 'rebass'
import { auth } from 'src/utils/firebase'
import { Form, Field } from 'react-final-form'
import { Button } from 'src/components/Button'
import { InputField } from 'src/components/Form/Fields'
import { colors } from 'src/themes/styled.theme'
import { UserStore } from 'src/stores/User/user.store'
import queryString from 'query-string'
import { Redirect, withRouter } from 'react-router-dom'
import PageContainer from 'src/components/Layout/PageContainer'
import { BoxContainer } from 'src/components/Layout/BoxContainer'

interface IState {
  verifyEmail: boolean
  resetPassword: boolean
  newPasswordSubmitted: boolean
  actionCode: string
  error: any
}

interface InjectedProps {
  userStore: UserStore
}

interface IFormValues {
  password: string
  passwordRepeat: string
}

@(withRouter as any)
@inject('userStore')
export class ActionPage extends React.Component<any, IState> {
  public state: IState = {
    verifyEmail: false,
    resetPassword: false,
    newPasswordSubmitted: false,
    actionCode: '',
    error: { actionCode: null, password: null },
  }

  formValues: IFormValues = {
    password: '',
    passwordRepeat: '',
  }

  get injected() {
    return this.props as InjectedProps
  }

  public componentDidMount() {
    const values = queryString.parse(this.props.location.search)
    let actionCode = values.oobCode as string
    if (values.mode === 'verifyEmail') {
      this.handleVerifyEmail(auth, actionCode)
      this.setState({ verifyEmail: true })
    } else if (values.mode === 'resetPassword') {
      this.handleResetPassword(auth, actionCode)
      this.setState({ resetPassword: true, actionCode })
    } else {
      this.props.history.push('/')
    }
  }

  public async handleVerifyEmail(auth, actionCode) {
    try {
      await auth.applyActionCode(actionCode)
    } catch (error) {
      this.setState({ error: error.message })
    }
  }

  public async handleResetPassword(auth, actionCode) {
    try {
      await auth.verifyPasswordResetCode(actionCode)
    } catch (error) {
      this.setState({ error: { actionCode: error.message } })
    }
  }

  public async submitNewPassword(values: IFormValues) {
    if (values.password === values.passwordRepeat) {
      auth.confirmPasswordReset(this.state.actionCode, values.password)
      this.setState({ newPasswordSubmitted: true })
    } else {
      this.setState({ error: { password: 'Passwords do not match.' } })
    }
  }
  public render() {
    if (this.state.error.actionCode) {
      return (
        <PageContainer>
          <BoxContainer>
            <Text textAlign={'center'} color={colors.error}>
              {this.state.error.actionCode}
            </Text>
          </BoxContainer>
        </PageContainer>
      )
    } else {
      return !this.props.userStore.authUser ? (
        <PageContainer>
          <BoxContainer>
            {this.state.verifyEmail ? (
              <Text textAlign={'center'}>
                Your email address has been verified. Thank you!
              </Text>
            ) : this.state.resetPassword && !this.state.newPasswordSubmitted ? (
              <>
                <Text color={colors.error}>{this.state.error.password}</Text>
                <Form
                  onSubmit={values =>
                    this.submitNewPassword(values as IFormValues)
                  }
                  initialValues={this.formValues}
                  render={({ handleSubmit, submitting, invalid }) => {
                    return (
                      <form onSubmit={handleSubmit}>
                        <Field
                          name="password"
                          component={InputField}
                          label="New password"
                          type="password"
                          required
                        />
                        <Field
                          name="passwordRepeat"
                          component={InputField}
                          label="Repeat password"
                          type="password"
                          required
                        />
                        <Button type="submit" disabled={submitting || invalid}>
                          Submit
                        </Button>
                      </form>
                    )
                  }}
                />
              </>
            ) : (
              <Text textAlign={'center'}>
                Your password has been changed successfully.
              </Text>
            )}
          </BoxContainer>
        </PageContainer>
      ) : (
        <Redirect to="/" />
      )
    }
  }
}
