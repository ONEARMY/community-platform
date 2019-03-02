import * as React from 'react'
import { inject, observer } from 'mobx-react'
import Link from 'react-router-dom/Link'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import Paper from '@material-ui/core/Paper'
import Avatar from '@material-ui/core/Avatar'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Input from '@material-ui/core/Input'
import Lock from '@material-ui/icons/Lock'
import { UserStore } from 'src/stores/User/user.store'
import { loginFormSubmit } from '../../../utils/user-migration'
import { auth } from '../../../utils/firebase'
import { theme } from '../../../themes/app.theme'

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

const styles: any = {
  layout: {
    width: 'auto',
    display: 'block', // Fix IE11 issue.
    paddingLeft: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit * 3,
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
  link: {
    marginTop: theme.spacing.unit * 2,
  },
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
        <main style={styles.layout}>
          <Paper style={styles.paper}>
            <Avatar style={styles.avatar}>
              <Lock />
            </Avatar>
            <Typography variant="h5">Sign in</Typography>
            <form style={styles.form} onSubmit={this.loginSubmit}>
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
                  fullWidth
                  variant="contained"
                  color="primary"
                  style={styles.submit}
                >
                  Resend confirmation email
                </Button>
              ) : null}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                style={styles.submit}
                disabled={this.state.submitDisabled}
              >
                Sign in
              </Button>
            </form>
            <Link
              style={styles.link}
              to="/sign-up"
              onClick={this.props.closeLogin}
            >
              Sign up
            </Link>
            <Link
              style={styles.link}
              to="#"
              onClick={this.props.openReset}
            >
              Forgot password?
            </Link>
          </Paper>
        </main>
      </React.Fragment>
    )
  }
}
