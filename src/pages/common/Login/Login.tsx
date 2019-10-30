import * as React from 'react'
import Modal from '@material-ui/core/Modal'
import { auth } from 'src/utils/firebase'
import { Button } from 'src/components/Button'
import { UserStore } from 'src/stores/User/user.store'
import { inject, observer } from 'mobx-react'
import { LoginForm } from './Login.form'
import { SignUpForm } from './SignUp.form'
import { ResetPWForm } from './ResetPW.form'
import { Box } from 'rebass'
import { display, DisplayProps } from 'styled-system'
import styled from 'styled-components'
import { Link } from 'src/components/Links'

const ButtonSign = styled(Button)<DisplayProps>`
  ${display}
`

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

/************** Notes on 10/1/19 : *******************/
/************** DEPPRECATED *******************/
/************** Login and Sign in is now handled in src/pages/SignIn and src/pages/SignUp */
/************** Keeping this component to implement reset password and then will delete */

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
  }

  public render() {
    const user = this.injected.userStore.user
    return (
      <>
        <Link to={'/sign-in'}>
          <ButtonSign
            variant="secondary"
            display={['none', 'none', 'flex']}
            small
            mr={2}
            data-cy="login"
            style={{ fontWeight: 'bold' }}
          >
            Login
          </ButtonSign>
        </Link>
        <Link to={'/sign-up'}>
          <ButtonSign
            display={['none', 'none', 'flex']}
            variant="colorful"
            small
            // onClick={this.toggleModal}
            data-cy="join"
          >
            Join
          </ButtonSign>
        </Link>
        <Modal
          aria-labelledby="user-login-modal"
          aria-describedby="click to show user login"
          open={this.state.showLoginModal && !user}
          onClose={this.toggleModal}
        >
          <Box width={350} mx="auto" mt={5}>
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
          </Box>
        </Modal>
      </>
    )
  }
}
