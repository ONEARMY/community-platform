import * as React from 'react'
import { inject, observer } from 'mobx-react'
import Typography from '@material-ui/core/Typography'
import CssBaseline from '@material-ui/core/CssBaseline'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Input from '@material-ui/core/Input'
import Lock from '@material-ui/icons/Lock'
import { Button } from 'src/components/Button'
import { Link } from 'src/components/Links'
import { UserStore } from 'src/stores/User/user.store'
import { colors } from 'src/themes/styled.theme'
import { Main, ModalPaper, ModalAvatar, Form } from './elements'
import { loginFormSubmit } from '../../../utils/user-migration'
import { auth } from '../../../utils/firebase'

interface IState {
  email: string
  password: string
  message?: string
  submitDisabled: boolean
  showResendConfirmationButton: boolean
}

interface IProps {
  closeLogin: () => void
  openReset: () => void
}

interface InjectedProps extends IProps {
  userStore: UserStore
}

@inject('userStore')
@observer
export class LoginFormComponent extends React.Component<IProps> {
  public state: IState = {
    email: '',
    password: '',
    submitDisabled: false,
    showResendConfirmationButton: false,
  }

  public get injected() {
    return this.props as InjectedProps
  }

  public loginSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    this.setState({ submitDisabled: true })
    this.processLogin()
  }

  // on login submit try call firebase auth sign in method
  public async processLogin() {
    if (auth.currentUser) {
      console.log('user already authenticated, signing out')
      auth.signOut()
    }
    console.log('attempting login')
    const status = await loginFormSubmit(this.state.email, this.state.password)
    console.log(status)
    if (!status.success) {
      this.setState({ message: status.message, submitDisabled: false })
    } else if (
      this.injected.userStore.authUser &&
      !this.injected.userStore.authUser.emailVerified
    ) {
      this.setState({
        message: 'Your email address is unverified',
        showResendConfirmationButton: true,
      })
    }
  }

  resendConfirmation = () => {
    this.injected.userStore.sendEmailVerification()
    this.props.closeLogin()
  }

  // generic function to handle form input changes
  public handleChange = (e: React.FormEvent<any>) => {
    this.setState({
      [e.currentTarget.id]: e.currentTarget.value,
    })
  }

  public render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <Main>
          <ModalPaper>
            <ModalAvatar>
              <Lock />
            </ModalAvatar>
            <Typography variant="h5">Sign in</Typography>
            <Form onSubmit={this.loginSubmit}>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="email">Email Address</InputLabel>
                <Input
                  id="email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  onChange={this.handleChange}
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input
                  name="password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={this.handleChange}
                />
              </FormControl>
              <Typography color="error">{this.state.message}</Typography>
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              {this.state.showResendConfirmationButton ? (
                <Button
                  onClick={this.resendConfirmation}
                  width={1}
                  variant="primary"
                  mb={3}
                >
                  Resend confirmation email
                </Button>
              ) : null}
              <Button
                type="submit"
                width={1}
                variant={this.state.submitDisabled ? 'disabled' : 'primary'}
                disabled={this.state.submitDisabled}
                mb={3}
              >
                Sign in
              </Button>
            </Form>
            <Link
              color={colors.blue2}
              mb={2}
              to="/sign-up"
              onClick={this.props.closeLogin}
            >
              Sign up
            </Link>
            <Link
              color={colors.blue2}
              mb={2}
              to="#"
              onClick={this.props.openReset}
            >
              Forgot password?
            </Link>
          </ModalPaper>
        </Main>
      </React.Fragment>
    )
  }
}
