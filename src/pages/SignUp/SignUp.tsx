import * as React from 'react'
import { FRIENDLY_MESSAGES } from 'oa-shared'
import { Card, Flex, Heading, Text, Label } from 'theme-ui'
import { Button, ExternalLink, FieldInput } from 'oa-components'
import { Form, Field } from 'react-final-form'
import { inject, observer } from 'mobx-react'
import type { UserStore } from 'src/stores/User/user.store'
import type { RouteComponentProps } from 'react-router'
import { withRouter, Redirect } from 'react-router'
import { string, object, ref, bool } from 'yup'
import { required } from 'src/utils/validators'
import { formatLowerNoSpecial } from 'src/utils/helpers'
import { Link } from 'react-router-dom'

interface IFormValues {
  email: string
  password: string
  passwordConfirmation: string
  displayName: string
  consent: boolean
}
interface IState {
  formValues: IFormValues
  errorMsg?: string
  disabled?: boolean
}
interface IProps extends RouteComponentProps<any> {
  onChange?: (e: React.FormEvent<any>) => void
  userStore?: UserStore
  preloadValues?: any
}

@inject('userStore')
@observer
class SignUpPage extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      formValues: {
        email: '',
        password: '',
        passwordConfirmation: '',
        displayName: '',
        consent: false,
      },
    }
  }

  public async checkUserNameUnique(userName: string) {
    const user = await this.props.userStore!.getUserProfile(userName)
    return user && !user._deleted ? false : true
  }

  async onSignupSubmit(v: IFormValues) {
    const { email, password, displayName } = v
    const userName = formatLowerNoSpecial(displayName as string)
    try {
      if (await this.checkUserNameUnique(userName)) {
        await this.props.userStore!.registerNewUser(
          email,
          password,
          displayName,
        )
        this.props.history.push('/sign-up-message')
      } else {
        this.setState({
          errorMsg: FRIENDLY_MESSAGES['sign-up username taken'],
          disabled: false,
        })
      }
    } catch (error) {
      this.setState({ errorMsg: error.message, disabled: false })
    }
  }

  public render() {
    if (this.props.userStore!.user) {
      return <Redirect to={'/'} />
    }

    return (
      <Form
        onSubmit={(v) => this.onSignupSubmit(v as IFormValues)}
        validate={async (values: any) => {
          const validationSchema = object({
            displayName: string().min(2, 'Too short').required('Required'),
            email: string().email('Invalid email').required('Required'),
            password: string().required('Password is required'),
            'confirm-password': string()
              .oneOf(
                [ref('password'), null],
                'Your new password does not match',
              )
              .required('Password confirm is required'),
            consent: bool().oneOf([true], 'Consent is required'),
          })

          try {
            await validationSchema.validate(values, { abortEarly: false })
          } catch (err) {
            return err.inner.reduce(
              (acc: any, error) => ({
                ...acc,
                [error.path]: error.message,
              }),
              {},
            )
          }
        }}
        render={({ submitting, invalid, handleSubmit }) => {
          const disabled = invalid || submitting
          return (
            <form onSubmit={handleSubmit}>
              <Flex
                bg="inherit"
                px={2}
                sx={{ width: '100%' }}
                css={{ maxWidth: '620px' }}
                mx={'auto'}
                mt={20}
                mb={3}
              >
                <Flex sx={{ flexDirection: 'column', width: '100%' }}>
                  <Card bg={'softblue'}>
                    <Flex px={3} py={2} sx={{ width: '100%' }}>
                      <Heading>Hey, nice to see you here</Heading>
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
                      <Heading variant="small" py={4} sx={{ width: '100%' }}>
                        Create an account
                      </Heading>
                      <Flex
                        mb={3}
                        sx={{
                          width: ['100%', '100%', `${(2 / 3) * 100}%`],
                          flexDirection: 'column',
                        }}
                      >
                        <Label htmlFor="displayName">
                          Username. Think carefully. You can't change this*
                        </Label>
                        <Field
                          data-cy="username"
                          name="displayName"
                          type="userName"
                          component={FieldInput}
                          placeholder="Pick a unique name"
                          validate={required}
                        />
                      </Flex>
                      <Flex
                        mb={3}
                        sx={{
                          flexDirection: 'column',
                          width: ['100%', '100%', `${(2 / 3) * 100}%`],
                        }}
                      >
                        <Label htmlFor="email">
                          Email, personal or workspace*
                        </Label>
                        <Field
                          data-cy="email"
                          name="email"
                          type="email"
                          component={FieldInput}
                          placeholder="hey@jack.com"
                          validate={required}
                        />
                      </Flex>
                      <Flex
                        mb={3}
                        sx={{
                          flexDirection: 'column',
                          width: ['100%', '100%', `${(2 / 3) * 100}%`],
                        }}
                      >
                        <Label htmlFor="password">Password*</Label>
                        <Field
                          data-cy="password"
                          name="password"
                          type="password"
                          component={FieldInput}
                          validate={required}
                        />
                      </Flex>
                      <Flex
                        mb={3}
                        sx={{
                          flexDirection: 'column',
                          width: ['100%', '100%', `${(2 / 3) * 100}%`],
                        }}
                      >
                        <Label htmlFor="confirm-password">
                          Confirm Password*
                        </Label>
                        <Field
                          data-cy="confirm-password"
                          name="confirm-password"
                          type="password"
                          component={FieldInput}
                          validate={required}
                        />
                      </Flex>
                      <Flex
                        mb={3}
                        mt={2}
                        sx={{ width: ['100%', '100%', `${(2 / 3) * 100}%`] }}
                      >
                        <Label>
                          <Field
                            data-cy="consent"
                            name="consent"
                            type="checkbox"
                            component="input"
                            validate={required}
                          />
                          <Text
                            sx={{
                              fontSize: 2,
                            }}
                          >
                            I agree to the{' '}
                            <ExternalLink href="/terms">
                              Terms of Service
                            </ExternalLink>
                            <span> and </span>
                            <ExternalLink href="/privacy">
                              Privacy Policy
                            </ExternalLink>
                          </Text>
                        </Label>
                      </Flex>
                      <Text color={'red'} data-cy="error-msg">
                        {this.state.errorMsg}
                      </Text>
                      <Flex mb={3} sx={{ justifyContent: 'space-between' }}>
                        <Text color={'grey'} mt={2} sx={{ fontSize: 1 }}>
                          Already have an account ?
                          <Link to="/sign-in"> Sign-in here</Link>
                        </Text>
                      </Flex>

                      <Flex>
                        <Button
                          large
                          data-cy="submit"
                          sx={{ width: '100%', justifyContent: 'center' }}
                          variant={'primary'}
                          disabled={disabled}
                          type="submit"
                        >
                          Create account
                        </Button>
                      </Flex>
                    </Flex>
                  </Card>
                </Flex>
              </Flex>
            </form>
          )
        }}
      />
    )
  }
}

export default withRouter(SignUpPage)
