import * as React from 'react'
import Flex from 'src/components/Flex'
import Heading from 'src/components/Heading'
import styled from 'styled-components'
import theme from 'src/themes/styled.theme'
import { Button } from 'src/components/Button'
import Text from 'src/components/Text'
import { Link } from 'src/components/Links'
import { InputField } from 'src/components/Form/Fields'
import { inject, observer } from 'mobx-react'
import { Form, Field } from 'react-final-form'

const Label = styled.label`
  font-size: ${theme.fontSizes[2] + 'px'};
  margin-bottom: ${theme.space[2] + 'px'};
  display: block;
`
interface IFormValues {
  email: string
  password: string
}
interface IState {
  formValues: IFormValues
  errorMsg?: string
  disabled?: boolean
}
interface IProps {
  onChange?: (e: React.FormEvent<any>) => void
  preloadValues?: any
}

@inject('userStore')
@observer
export class SignInPage extends React.Component<IProps, IState> {
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

  onLoginSubmit(e) {
    console.log(e)
  }

  public render() {
    const disabled =
      this.state.disabled ||
      this.state.formValues.email === '' ||
      this.state.formValues.password === ''
    return (
      <Form
        onSubmit={e => this.onLoginSubmit(e)}
        render={() => (
          <form>
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
                <Flex card mediumRadius bg={'softblue'} px={3} py={2} width={1}>
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
                  <Heading small arrowDown py={4} width={1}>
                    Log in to your account
                  </Heading>
                  <Flex flexDirection={'column'} mb={3}>
                    <Label htmlFor="title">Email / Username</Label>
                    <Field
                      name="email"
                      type="email"
                      id="email"
                      component={InputField}
                      autoComplete="email"
                    />
                  </Flex>
                  <Flex flexDirection={'column'} mb={3}>
                    <Label htmlFor="title">Password</Label>
                    <Field
                      name="password"
                      type="password"
                      id="password"
                      component={InputField}
                      autoComplete="current-password"
                    />
                  </Flex>
                  <Flex mb={3} justifyContent={'space-between'}>
                    <Text small color={'grey'} mt={2}>
                      <Link to="#">Don't have an account?</Link>
                    </Text>
                    <Text small color={'grey'} mt={2}>
                      <Link to="#">Lost password?</Link>
                    </Text>
                  </Flex>

                  <Flex>
                    <Button
                      width={1}
                      variant={'primary'}
                      disabled={disabled}
                      type="submit"
                    >
                      Log in
                    </Button>
                  </Flex>
                </Flex>
                <Flex mt={3} justifyContent={'flex-end'}>
                  <Button variant="tertiary" small>
                    Close
                  </Button>
                </Flex>
              </Flex>
            </Flex>
          </form>
        )}
      />
    )
  }
}
