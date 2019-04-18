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
import { auth } from '../../../utils/firebase'

interface IState {
  email: string
  password: string
  passwordConfirmation?: string
  submitDisabled: boolean
  isSignIn: boolean
  errorMsg?: string
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
export class LoginFormComponent extends React.Component<IProps, IState> {
  public state: IState = {
    email: '',
    password: '',
    passwordConfirmation: '',
    submitDisabled: false,
    isSignIn: true,
  }

  public get injected() {
    return this.props as InjectedProps
  }

  public loginSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    this.setState({ submitDisabled: true })
    this.processLogin()
  }

  public signUpSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    this.setState({ submitDisabled: true })
    this.processSignup()
  }

  public async processSignup() {
    const { email, password } = this.state
    try {
      await this.injected.userStore.registerNewUser(email, password)
    } catch (error) {
      this.setState({ errorMsg: error.message, submitDisabled: false })
    }
  }

  // on login submit try call firebase auth sign in method
  public async processLogin() {
    const { email, password } = this.state
    try {
      await this.injected.userStore.login(email, password)
    } catch (error) {
      this.setState({ errorMsg: error.message, submitDisabled: false })
    }
  }

  // generic function to handle form input changes
  public handleChange = (e: React.FormEvent<any>) => {
    const update = {
      [e.currentTarget.id]: e.currentTarget.value,
    } as IState
    this.setState(update)
  }

  public validateLoginForm = () => {
    const { email, password, passwordConfirmation, isSignIn } = this.state
    let valid = false
    if (email !== '' && password !== '') {
      valid = isSignIn ? true : password === passwordConfirmation
    }
    return valid
  }

  // swap between sign up and sign in modes
  public toggleSignUp = () => {
    this.setState({ isSignIn: !this.state.isSignIn })
  }

  // render combination of email, pw and additional fields depending on whether part of sign-up or sign-in process
  public render() {
    const disabled = this.state.submitDisabled || !this.validateLoginForm()
    return (
      <React.Fragment>
        <CssBaseline />
        <Main>
          <ModalPaper>
            <ModalAvatar>
              <Lock />
            </ModalAvatar>
            <Typography variant="h5">
              {this.state.isSignIn ? 'Sign In' : 'Sign Up'}
            </Typography>
            {/* Same email and pw field displayed on both sign-up and sign-in */}
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
              {this.state.isSignIn && (
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
              )}
              {!this.state.isSignIn && (
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="password">Confirm Password</InputLabel>
                  <Input
                    name="passwordConfirmation"
                    type="password"
                    id="passwordConfirmation"
                    autoComplete="password-confirmation"
                    onChange={this.handleChange}
                  />
                </FormControl>
              )}
            </Form>

            {this.state.isSignIn ? (
              // sign in additional
              <>
                <Button
                  type="submit"
                  width={1}
                  variant={disabled ? 'disabled' : 'outline'}
                  disabled={disabled}
                  mb={3}
                  onClick={this.loginSubmit}
                >
                  Sign in
                </Button>
                <Link
                  color={colors.blue2}
                  mb={2}
                  to="#"
                  onClick={this.toggleSignUp}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              // sign up additional
              <>
                <Button
                  type="submit"
                  width={1}
                  variant={disabled ? 'disabled' : 'outline'}
                  disabled={disabled}
                  mb={3}
                  onClick={this.signUpSubmit}
                >
                  Sign Up
                </Button>
                <Link
                  color={colors.blue2}
                  mb={2}
                  to="#"
                  onClick={this.toggleSignUp}
                >
                  Sign in
                </Link>
              </>
            )}

            <Link
              color={colors.blue2}
              mb={2}
              to="#"
              onClick={this.props.openReset}
            >
              Forgot password?
            </Link>
            <Typography color="error" variant="caption">
              {this.state.errorMsg}
            </Typography>
          </ModalPaper>
        </Main>
      </React.Fragment>
    )
  }
}
