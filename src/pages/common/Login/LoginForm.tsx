import * as React from 'react'
import { inject, observer } from 'mobx-react'
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

import Link from 'react-router-dom/Link'
import Lock from '@material-ui/icons/Lock'
import { loginFormSubmit } from '../../../utils/user-migration'
import { auth } from '../../../utils/firebase'
import { theme } from '../../../themes/app.theme'

interface IState {
  email: string
  password: string
  message?: string
  submitDisabled: boolean
  userUnverified: boolean
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
  }
}

export class LoginFormComponent extends React.Component<IProps> {
  unsubscribe: any

  public state: IState = {
    email: '',
    password: '',
    submitDisabled: false,
    userUnverified: false,
  }

  componentDidMount() {
    this.unsubscribe = auth.onAuthStateChanged(async authUser => {
      if (authUser && authUser.emailVerified) {
        console.log('User authenticated')
        this.props.closeLogin()
      } else if (authUser && !authUser.emailVerified) {
        console.log('User has unverified email')
        this.setState({ userUnverified: true })
      }
    })
  }

  componentWillUnmount() {
    this.unsubscribe()
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
    await loginFormSubmit(this.state.email, this.state.password)
    // try {
    //   const status = await auth.signInWithEmailAndPassword(
    //     this.state.email,
    //     this.state.password,
    //   )
    //   this.setState({ message: null })
    //   console.log('signed in successfully', status)
    // } catch (error) {
    //   this.setState({ message: error.message, submitDisabled: false })
    // }
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
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
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
            {
              this.state.userUnverified ? (
              <Link
              style={styles.link}
              to="/email-confirmation"
              onClick={this.props.closeLogin}
              >
                Your email is unverified. Resend confirmation message.
              </Link>
              ) :null
            }
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
            <Typography color="error">{this.state.message}</Typography>
          </Paper>
        </main>
      </React.Fragment>
    )
  }
}
