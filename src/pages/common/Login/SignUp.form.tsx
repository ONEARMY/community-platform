import * as React from 'react'
import { Button } from 'src/components/Button'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'
import { UserStore } from 'src/stores/User/user.store'
import Heading from 'src/components/Heading'
import { Typography } from '@material-ui/core'
import { Form } from 'react-final-form'

interface IFormValues {
  email: string
  password: string
  passwordConfirmation: string
  userName: string
}
interface IState {
  formValues: IFormValues
  errorMsg?: string
  disabled?: boolean
}
interface IProps {
  onChange: (e: React.FormEvent<any>) => void
  userStore: UserStore
  preloadValues?: any
}

export class SignUpForm extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      formValues: {
        email: '',
        password: '',
        passwordConfirmation: '',
        userName: '',
      },
    }
  }

  public signUpSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    this.setState({ disabled: true })
    this.processSignup()
  }

  public async processSignup() {
    const { email, password, userName } = this.state.formValues
    try {
      if (await this.checkUserNameUnique(userName)) {
        await this.props.userStore.registerNewUser(email, password, userName)
      } else {
        this.setState({
          errorMsg: 'That username is already taken',
          disabled: false,
        })
      }
    } catch (error) {
      this.setState({ errorMsg: error.message, disabled: false })
    }
  }

  // track change internally for validation and emit to parent for processing
  handleChange(e: React.FormEvent<any>) {
    const nextValues = { ...this.state.formValues }
    ;(nextValues[e.currentTarget.id] = e.currentTarget.value),
      this.setState({ formValues: nextValues })
    this.props.onChange(e)
  }

  public async checkUserNameUnique(userName: string) {
    const user = await this.props.userStore.getUserProfile(userName)
    return user ? false : true
  }

  public render = () => {
    const {
      email,
      password,
      userName,
      passwordConfirmation,
    } = this.state.formValues
    const disabled =
      this.state.disabled ||
      email === '' ||
      password === '' ||
      passwordConfirmation !== password ||
      userName === ''
    return (
      <Form
        onSubmit={e => this.signUpSubmit(e as any)}
        initialValues={this.state.formValues}
        render={() => (
          <form>
            <Heading medium textAlign="center">
              Join One Army
            </Heading>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Username</InputLabel>
              <Input
                id="userName"
                name="userName"
                autoComplete="userName"
                autoFocus
                onChange={e => this.handleChange(e)}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Email Address</InputLabel>
              <Input
                id="email"
                name="email"
                autoComplete="email"
                onChange={e => this.handleChange(e)}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                name="password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={e => this.handleChange(e)}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Confirm Password</InputLabel>
              <Input
                name="passwordConfirmation"
                type="password"
                id="passwordConfirmation"
                autoComplete="password-confirmation"
                onChange={e => this.handleChange(e)}
              />
            </FormControl>
            <Button
              type="submit"
              width={1}
              variant={disabled ? 'disabled' : 'dark'}
              disabled={disabled}
              mb={3}
              onClick={e => this.signUpSubmit(e)}
            >
              Sign Up
            </Button>
            <Typography color="error" variant="caption">
              {this.state.errorMsg}
            </Typography>
          </form>
        )}
      />
    )
  }
}
