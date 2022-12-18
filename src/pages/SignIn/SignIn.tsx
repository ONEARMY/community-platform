import * as React from 'react'
import { getFriendlyMessage } from 'oa-shared'
import { Card, Flex, Heading, Text, Label, Box } from 'theme-ui'
import type { RouteComponentProps } from 'react-router'
import { withRouter, Redirect } from 'react-router'
import { Button, FieldInput, TextNotification } from 'oa-components'
import { inject, observer } from 'mobx-react'
import { Form, Field } from 'react-final-form'
import type { UserStore } from 'src/stores/User/user.store'
import type { TextNotificationProps } from 'oa-components'
import { required } from 'src/utils/validators'
import { Link } from 'react-router-dom'

interface IFormValues {
  email: string
  password: string
}
interface IState {
  formValues: IFormValues
  errorMsg?: string
  disabled?: boolean
  authProvider?: IAuthProvider
  notificationProps?: Pick<TextNotificationProps, 'isVisible' | 'variant'> & {
    text: string
  }
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

const AUTH_PROVIDERS: { [provider: string]: IAuthProvider } = {
  firebase: {
    provider: 'Firebase',
    buttonLabel: 'Email / Password',
    inputLabel: 'Email Address',
  },
}

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
      authProvider: AUTH_PROVIDERS.firebase,
    }
  }

  async onLoginSubmit(v: IFormValues) {
    this.setState({ disabled: true })
    const provider = (this.state.authProvider as IAuthProvider).provider
    try {
      await this.props.userStore!.login(provider, v.email, v.password)
      this.props.history.goBack()
    } catch (error) {
      const friendlyErrorMessage = getFriendlyMessage(error.code)
      this.setState({ errorMsg: friendlyErrorMessage, disabled: false })
    }
  }

  async resetPasword(inputEmail: string) {
    try {
      await this.props.userStore!.sendPasswordResetEmail(inputEmail)
      this.setState({
        notificationProps: {
          isVisible: true,
          text: 'Reset email sent',
          variant: 'success',
        },
      })
    } catch (error) {
      this.setState({
        notificationProps: {
          isVisible: true,
          text: error.code,
          variant: 'failure',
        },
      })
    }
  }

  public render() {
    const { authProvider, notificationProps } = this.state
    if (this.props.userStore!.user) {
      // User logged in
      return <Redirect to={'/'} />
    }
    return (
      <Form
        onSubmit={(v) => this.onLoginSubmit(v as IFormValues)}
        render={({ submitting, values, invalid, handleSubmit }) => {
          // eslint-disable-next-line
          const disabled = invalid || submitting
          return (
            <>
              <form data-cy="login-form" onSubmit={handleSubmit}>
                <Flex
                  bg="inherit"
                  px={2}
                  sx={{ width: '100%' }}
                  css={{ maxWidth: '620px' }}
                  mx={'auto'}
                  mt={['20px', '100px']}
                  mb={3}
                >
                  <Flex sx={{ flexDirection: 'column', width: '100%' }}>
                    <Card bg={'softblue'}>
                      <Flex px={3} py={2}>
                        <Heading>Welcome back</Heading>
                      </Flex>
                    </Card>
                    <Card mt={3}>
                      <Flex
                        px={4}
                        pt={0}
                        pb={4}
                        sx={{
                          flexWrap: 'wrap',
                          flexDirection: 'column',
                          width: '100%',
                        }}
                      >
                        {/* PauthProvider Provider Select */}
                        {!this.state.authProvider && (
                          <>
                            <Text mb={3} mt={3}>
                              Login with :
                            </Text>
                            {Object.values(AUTH_PROVIDERS).map((p) => (
                              <Button
                                sx={{ width: '100%' }}
                                key={p.provider}
                                mb={2}
                                variant="outline"
                                onClick={() =>
                                  this.setState({ authProvider: p })
                                }
                              >
                                {p.buttonLabel}
                              </Button>
                            ))}
                          </>
                        )}
                        {/* Login Form */}
                        {this.state.authProvider && (
                          <>
                            <Heading
                              variant="small"
                              py={4}
                              sx={{ width: '100%' }}
                            >
                              Log in to your account
                            </Heading>
                            <Flex sx={{ flexDirection: 'column' }} mb={3}>
                              <Label htmlFor="title">
                                {authProvider!.inputLabel}
                              </Label>
                              <Field
                                name="email"
                                type="email"
                                data-cy="email"
                                component={FieldInput}
                                validate={required}
                              />
                            </Flex>
                            <Flex sx={{ flexDirection: 'column' }} mb={3}>
                              <Label htmlFor="title">Password</Label>
                              <Field
                                name="password"
                                type="password"
                                data-cy="password"
                                component={FieldInput}
                                validate={required}
                              />
                            </Flex>
                            <Text color={'red'}>{this.state.errorMsg}</Text>
                            <Flex
                              mb={1}
                              sx={{ justifyContent: 'space-between' }}
                            >
                              <Text sx={{ fontSize: 1 }} color={'grey'} mt={2}>
                                <Link to={'/sign-up'} data-cy="no-account">
                                  Don't have an account?
                                </Link>
                              </Text>
                              <Text sx={{ fontSize: 1 }} color={'grey'} mt={2}>
                                <Link
                                  to="#"
                                  data-cy="lost-password"
                                  onClick={() =>
                                    this.resetPasword(values.email)
                                  }
                                >
                                  Lost password?
                                </Link>
                              </Text>
                            </Flex>

                            {notificationProps && (
                              <Box
                                sx={{
                                  marginBottom: 3,
                                }}
                              >
                                <TextNotification
                                  isVisible={notificationProps.isVisible}
                                  variant={notificationProps.variant}
                                >
                                  {getFriendlyMessage(notificationProps?.text)}
                                </TextNotification>
                              </Box>
                            )}

                            <Flex>
                              <Button
                                large
                                data-cy="submit"
                                sx={{ width: '100%', justifyContent: 'center' }}
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
                    </Card>
                  </Flex>
                </Flex>
              </form>
            </>
          )
        }}
      />
    )
  }
}

export default withRouter(SignInPage)
