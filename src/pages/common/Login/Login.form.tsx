import * as React from 'react'
import { Button } from 'src/components/Button'
import Typography from '@material-ui/core/Typography'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'
import { Link } from 'src/components/Links'
import { colors } from 'src/themes/styled.theme'
import { FlexContainer } from 'src/components/Layout/FlexContainer'
import { UserStore } from 'src/stores/User/user.store'
import { Form } from 'react-final-form'
import Heading from 'src/components/Heading'
import Text from 'src/components/Text'

interface IAuthProvider {
  provider: string
  buttonLabel: string
  inputLabel: string
}
const AUTH_PROVIDERS: IAuthProvider[] = [
  {
    provider: 'DH',
    buttonLabel: 'Dave Hakkens',
    inputLabel: 'DaveHakkens.nl User',
  },
  {
    provider: 'Firebase',
    buttonLabel: 'Email / Password',
    inputLabel: 'Email Address',
  },
]

interface IFormValues {
  email: string
  password: string
}
interface IState {
  formValues: IFormValues
  errorMsg?: string
  disabled?: boolean
  authProvider?: IAuthProvider
}
interface IProps {
  onChange: (e: React.FormEvent<any>) => void
  onForgotPWClick: () => void
  onSignUpLinkClick: () => void
  userStore: UserStore
  preloadValues?: any
}

export class LoginForm extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      // if passed form values from props initially populate
      formValues: {
        email: props.preloadValues ? props.preloadValues.email : '',
        password: props.preloadValues ? props.preloadValues.password : '',
      },
    }
  }

  // on login submit try call firebase auth sign in method
  public async processLogin(e) {
    e.preventDefault()
    console.log('processing login')
    this.setState({ disabled: true })
    const { email, password } = this.state.formValues
    const provider = (this.state.authProvider as IAuthProvider).provider
    try {
      await this.props.userStore.login(provider, email, password)
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

  public render = () => {
    const disabled =
      this.state.disabled ||
      this.state.formValues.email === '' ||
      this.state.formValues.password === ''
    const auth = this.state.authProvider
    return (
      <Form
        onSubmit={e => this.processLogin(e)}
        initialValues={this.state.formValues}
        render={() => (
          <form>
            <Heading medium mb={1} large textAlign="center">
              Welcome Back
            </Heading>
            {/* Auth Provider Select */}
            {!this.state.authProvider && (
              <>
                <Text mb={3} mt={3}>
                  Login with
                </Text>
                {AUTH_PROVIDERS.map(p => (
                  <Button
                    width={1}
                    key={p.provider}
                    mb={2}
                    variant="outline"
                    onClick={() => this.setState({ authProvider: p })}
                  >
                    {p.buttonLabel}
                  </Button>
                ))}
              </>
            )}
            {/* Login Form */}
            {this.state.authProvider && (
              <>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="email">{auth!.inputLabel}</InputLabel>
                  <Input
                    id="email"
                    name="email"
                    autoComplete="email"
                    autoFocus
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
                <FlexContainer
                  justifyContent="flex-end"
                  p={0}
                  alignItems="center"
                  my={3}
                >
                  <Link
                    color={colors.black}
                    to="#"
                    onClick={this.props.onForgotPWClick}
                    variant="caption"
                  >
                    Forgot password?
                  </Link>
                </FlexContainer>
                <Button
                  width={1}
                  variant={disabled ? 'disabled' : 'dark'}
                  disabled={disabled}
                  mb={3}
                  type="submit"
                  onClick={e => this.processLogin(e)}
                >
                  Log in
                </Button>
                <FlexContainer
                  justifyContent="flex-end"
                  p={0}
                  alignItems="baseline"
                >
                  <Typography variant="caption">
                    Don't have an account?
                  </Typography>
                  <Link
                    color={colors.black}
                    ml={1}
                    to="#"
                    onClick={this.props.onSignUpLinkClick}
                  >
                    Sign Up!
                  </Link>
                </FlexContainer>
                <Typography color="error" variant="caption">
                  {this.state.errorMsg}
                </Typography>
              </>
            )}
          </form>
        )}
      />
    )
  }
}
