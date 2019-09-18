import * as React from 'react'
import Flex from 'src/components/Flex'
import { RouteComponentProps, withRouter } from 'react-router'
import Heading from 'src/components/Heading'
import { Button } from 'src/components/Button'
import Text from 'src/components/Text'
import { Link } from 'src/components/Links'
import { InputField } from 'src/components/Form/Fields'
import { inject, observer } from 'mobx-react'
import { Form, Field } from 'react-final-form'
import { UserStore } from 'src/stores/User/user.store'

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
interface IProps extends RouteComponentProps<any> {
  onChange?: (e: React.FormEvent<any>) => void
  userStore?: UserStore
  preloadValues?: any
}

interface IAuthProvider {
  provider: string
  buttonLabel: string
  inputLabel: string
}

const AUTH_PROVIDERS: IAuthProvider[] = [
  {
    provider: 'DH',
    buttonLabel: 'Dave Hakkens',
    inputLabel: 'davehakkens.nl Username',
  },
  {
    provider: 'Firebase',
    buttonLabel: 'Email / Password',
    inputLabel: 'Email Address',
  },
]

// validation - return undefined if no error (i.e. valid)
const required = (value: any) => (value ? undefined : 'Required')

@inject('userStore')
@observer
class SignInPage extends React.Component<IProps, IState> {
  static defaultProps: Partial<IProps>
  constructor(props: IProps) {
    super(props)
    this.state = {
      // if passed form values from props initially populate
      formValues: {
        email: props.preloadValues ? props.preloadValues.email : '',
        password: props.preloadValues ? props.preloadValues.password : '',
      },
      // TODO remove initialization of authProvider state when DH login will be fixed
      authProvider: AUTH_PROVIDERS[1],
    }
  }

  async onLoginSubmit(v: IFormValues) {
    this.setState({ disabled: true })
    const provider = (this.state.authProvider as IAuthProvider).provider
    try {
      await this.props.userStore!.login(provider, v.email, v.password)
      this.props.history.push('/')
    } catch (error) {
      this.setState({ errorMsg: error.message, disabled: false })
    }
  }

  public render() {
    const auth = this.state.authProvider
    return (
      <Form
        onSubmit={v => this.onLoginSubmit(v as IFormValues)}
        render={({ submitting, values, invalid, handleSubmit }) => {
          const disabled = invalid || submitting
          return (
            <form onSubmit={handleSubmit}>
              <Flex
                bg="inherit"
                px={2}
                width={1}
                css={{ maxWidth: '620px' }}
                mx={'auto'}
                mt={20}
                mb={3}
              >
                <Flex flexDirection={'column'} width={1}>
                  <Flex
                    card
                    mediumRadius
                    bg={'softblue'}
                    px={3}
                    py={2}
                    width={1}
                  >
                    <Heading medium width={1}>
                      Welcome back homie
                    </Heading>
                  </Flex>
                  <Flex
                    card
                    mediumRadius
                    bg={'white'}
                    width={1}
                    mt={3}
                    px={4}
                    pt={0}
                    pb={4}
                    flexWrap="wrap"
                    flexDirection="column"
                  >
                    {/* Auth Provider Select */}
                    {!this.state.authProvider && (
                      <>
                        <Text mb={3} mt={3}>
                          Login with :
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
                        <Heading small py={4} width={1}>
                          Log in to your account
                        </Heading>
                        <Flex flexDirection={'column'} mb={3}>
                          <Text as={'label'} small htmlFor="title">
                            {auth!.inputLabel}
                          </Text>
                          <Field
                            name="email"
                            type="email"
                            component={InputField}
                            validate={required}
                          />
                        </Flex>
                        <Flex flexDirection={'column'} mb={3}>
                          <Text as={'label'} small htmlFor="title">
                            Password
                          </Text>
                          <Field
                            name="password"
                            type="password"
                            component={InputField}
                            validate={required}
                          />
                        </Flex>
                        <Text color={'red'}>{this.state.errorMsg}</Text>
                        <Flex mb={3} justifyContent={'space-between'}>
                          <Text small color={'grey'} mt={2}>
                            <Link to={'/sign-up'}>Don't have an account?</Link>
                          </Text>
                          <Text small color={'grey'} mt={2}>
                            <Link to="#">Lost password?</Link>
                          </Text>
                        </Flex>

                        <Flex>
                          <Button
                            width={1}
                            variant={'primary'}
                            disabled={submitting || invalid}
                            type="submit"
                          >
                            Log in
                          </Button>
                        </Flex>
                      </>
                    )}
                  </Flex>
                </Flex>
              </Flex>
            </form>
          )
        }}
      />
    )
  }
}

export default withRouter(SignInPage)
