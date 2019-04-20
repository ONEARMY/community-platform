import * as React from 'react'
import Modal from '@material-ui/core/Modal'
import { auth } from 'src/utils/firebase'
import { Button } from 'src/components/Button'
import { UserStore } from 'src/stores/User/user.store'
import { inject, observer } from 'mobx-react'
import Typography from '@material-ui/core/Typography'
import CssBaseline from '@material-ui/core/CssBaseline'
import { Main, ModalPaper, Form } from './elements'
import { LoginForm } from './Login.form'
import { SignUpForm } from './SignUp.form'
import { ResetPWForm } from './ResetPW.form'
import { BoxContainer } from 'src/components/Layout/BoxContainer'

interface IProps {
  userStore?: UserStore
}

interface IFormValues {
  email: string
  password: string
  userName: string
  passwordConfirmation?: string
}
interface IState {
  showLoginModal: boolean
  submitDisabled?: boolean
  formValues: IFormValues
  showSignUpForm?: boolean
  showLoginForm?: boolean
  showResetPWForm?: boolean
  errorMsg?: string
}

interface InjectedProps extends IProps {
  userStore: UserStore
}

@inject('userStore')
@observer
export class LoginComponent extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      showLoginModal: false,
      showLoginForm: true,
      formValues: {
        email: '',
        password: '',
        userName: '',
      },
    }
  }

  public get injected() {
    return this.props as InjectedProps
  }

  public logout = () => {
    auth.signOut()
  }

  public toggleModal = () => {
    this.setState({
      showLoginModal: !this.state.showLoginModal,
      showLoginForm: true,
      showResetPWForm: false,
      showSignUpForm: false,
    })
  }

  // generic function to handle form input changes
  // these values can then be shared between the different form components
  // (e.g. to retain the email typed when moving to forgot pw)
  public handleChange = (e: React.FormEvent<any>) => {
    const nextValues = { ...this.state.formValues }
    ;(nextValues[e.currentTarget.id] = e.currentTarget.value),
      this.setState({ formValues: nextValues })
    console.log('state', this.state.formValues)
  }

  public render() {
    const user = this.injected.userStore.user
    console.log('login user', user)
    return (
      <>
        <Button onClick={this.toggleModal}>Log in</Button>
        <Modal
          aria-labelledby="user-login-modal"
          aria-describedby="click to show user login"
          open={this.state.showLoginModal && !user}
          onClose={this.toggleModal}
        >
          <BoxContainer width={350} mx="auto" mt={5}>
            {this.state.showLoginForm && (
              <LoginForm
                onChange={e => this.handleChange(e)}
                onForgotPWClick={() =>
                  this.setState({
                    showResetPWForm: true,
                    showLoginForm: false,
                    showSignUpForm: false,
                  })
                }
                onSignUpLinkClick={() =>
                  this.setState({
                    showResetPWForm: false,
                    showLoginForm: false,
                    showSignUpForm: true,
                  })
                }
                userStore={this.injected.userStore}
                preloadValues={this.state.formValues}
              />
            )}
            {this.state.showSignUpForm && (
              <SignUpForm
                onChange={e => this.handleChange(e)}
                userStore={this.injected.userStore}
                preloadValues={this.state.formValues}
              />
            )}
            {this.state.showResetPWForm && (
              <ResetPWForm
                onChange={e => this.handleChange(e)}
                userStore={this.injected.userStore}
                preloadValues={this.state.formValues}
              />
            )}
          </BoxContainer>
        </Modal>
      </>
    )
  }
}
