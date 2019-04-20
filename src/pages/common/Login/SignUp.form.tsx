import * as React from 'react'
import { Button } from 'src/components/Button'
import Typography from '@material-ui/core/Typography'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'
import { UserStore } from 'src/stores/User/user.store'
import Heading from 'src/components/Heading'

interface IFormValues {
  email: string
  password: string
  passwordConfirmation: string
  userName: string
}
interface IState {
  formValues: IFormValues
  errorMsg?: boolean
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
  public validateForm() {
    return true
  }

  public signUpSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    this.setState({ disabled: true })
    this.processSignup()
  }

  public async processSignup() {
    const { email, password } = this.state.formValues
    try {
      await this.props.userStore.registerNewUser(email, password)
    } catch (error) {
      this.setState({ errorMsg: error.message, disabled: false })
    }
  }

  public render = () => {
    const disabled = this.state.disabled
    return (
      <>
        <Heading medium textAlign="center">
          Sign Up
        </Heading>
        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="email">Email Address</InputLabel>
          <Input
            id="email"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={this.props.onChange}
          />
        </FormControl>
        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input
            name="password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={this.props.onChange}
          />
        </FormControl>
        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="password">Confirm Password</InputLabel>
          <Input
            name="passwordConfirmation"
            type="password"
            id="passwordConfirmation"
            autoComplete="password-confirmation"
            onChange={this.props.onChange}
          />
        </FormControl>
        <Button
          type="submit"
          width={1}
          variant={disabled ? 'disabled' : 'outline'}
          disabled={disabled}
          mb={3}
          onClick={this.props.onChange}
        >
          Sign Up
        </Button>
      </>
    )
  }
}
