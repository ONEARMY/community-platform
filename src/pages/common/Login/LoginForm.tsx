import * as React from 'react'
import {
  Typography,
  Button,
  CssBaseline,
  Paper,
  Avatar,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
  Input,
} from '@material-ui/core'
import Lock from '@material-ui/icons/Lock'
import { loginFormSubmit } from '../../../utils/user-migration'
import { auth } from '../../../utils/firebase'
import { theme } from '../../../themes/app.theme'

interface IState {
  email: string
  password: string
  message?: string
  submitDisabled: boolean
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
}

export class LoginFormComponent extends React.Component {
  public state: IState = {
    email: '',
    password: '',
    submitDisabled: false,
  }

  public loginSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    this.setState({ submitDisabled: true })
    this.processLogin()
  }

  // on login submit try call firebase auth sign in method
  public async processLogin() {
    console.log('attempting login')
    loginFormSubmit(this.state.email, this.state.password)
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
            <Typography color="error">{this.state.message}</Typography>
          </Paper>
        </main>
      </React.Fragment>
    )
  }
}
