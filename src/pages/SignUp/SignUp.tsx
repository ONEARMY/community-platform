import * as React from 'react'
import Flex from 'src/components/Flex'
import Heading from 'src/components/Heading'
import styled from 'styled-components'
import theme from 'src/themes/styled.theme'
import { Button } from 'src/components/Button'
import Text from 'src/components/Text'
import { Link } from 'src/components/Links'
import { Form, Field } from 'react-final-form'
import { InputField } from 'src/components/Form/Fields'
import { inject, observer } from 'mobx-react'
import { UserStore } from 'src/stores/User/user.store'
import { RouteComponentProps, withRouter } from 'react-router'

const Label = styled.label`
  font-size: ${theme.fontSizes[2] + 'px'};
  margin-bottom: ${theme.space[2] + 'px'};
  display: block;
`

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
interface IProps extends RouteComponentProps<any> {
  onChange?: (e: React.FormEvent<any>) => void
  userStore?: UserStore
  preloadValues?: any
}

// validation - return undefined if no error (i.e. valid)
const required = (value: any) => (value ? undefined : 'Required')

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
        userName: '',
      },
    }
  }

  public async checkUserNameUnique(userName: string) {
    const user = await this.props.userStore!.getUserProfile(userName)
    return user && !user._deleted ? false : true
  }

  async onSignupSubmit(v: IFormValues) {
    const { email, password, userName } = v
    try {
      if (await this.checkUserNameUnique(userName)) {
        await this.props.userStore!.registerNewUser(email, password, userName)
        this.props.history.push('/sign-up-message')
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

  public render() {
    return (
      <Form
        onSubmit={v => this.onSignupSubmit(v as IFormValues)}
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
                      Hey, nice to see you here
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
                    <Heading small py={4} width={1}>
                      Create an account
                    </Heading>
                    <Flex flexDirection={'column'} mb={3} width={[1, 1, 2 / 3]}>
                      <Label htmlFor="userName">
                        Username, personal or workspace
                      </Label>
                      <Field
                        data-cy="username"
                        name="userName"
                        type="userName"
                        component={InputField}
                        placeholder="Pick a unique username"
                        validate={required}
                      />
                    </Flex>
                    <Flex flexDirection={'column'} mb={3} width={[1, 1, 2 / 3]}>
                      <Label htmlFor="email">
                        Email, personal or workspace
                      </Label>
                      <Field
                        data-cy="email"
                        name="email"
                        type="email"
                        component={InputField}
                        placeholder="hey@jack.com"
                        validate={required}
                      />
                    </Flex>
                    <Flex flexDirection={'column'} mb={3} width={[1, 1, 2 / 3]}>
                      <Label htmlFor="password">Password</Label>
                      <Field
                        data-cy="password"
                        name="password"
                        type="password"
                        component={InputField}
                        validate={required}
                      />
                    </Flex>
                    <Flex flexDirection={'column'} mb={3} width={[1, 1, 2 / 3]}>
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Field
                        data-cy="confirm-password"
                        name="confirm-password"
                        type="password"
                        component={InputField}
                        validate={required}
                      />
                    </Flex>
                    <Text color={'red'} data-cy="error-msg">{this.state.errorMsg}</Text>
                    <Flex mb={3} justifyContent={'space-between'}>
                      <Text small color={'grey'} mt={2}>
                        Already have an account ?
                        <Link to="/sign-in"> Sign-in here</Link>
                      </Text>
                    </Flex>

                    <Flex>
                      <Button
                        data-cy="submit"
                        width={1}
                        variant={'primary'}
                        disabled={disabled}
                        type="submit"
                      >
                        Create account
                      </Button>
                    </Flex>
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

export default withRouter(SignUpPage)
