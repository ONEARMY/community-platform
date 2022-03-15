import * as React from 'react'
import { Field, Form } from 'react-final-form'
import { Button } from 'oa-components'
import { InputField } from 'src/components/Form/Fields'
import { UserStore } from 'src/stores/User/user.store'
import Text from 'src/components/Text'
import theme from 'src/themes/styled.theme'
import styled from '@emotion/styled'
import Flex from 'src/components/Flex'

interface IFormValues {
  password?: string
  newEmail?: string
}
interface IState {
  errorMsg?: string
  msg?: string
  showChangeEmailForm?: boolean
  formValues: IFormValues
  email?: string
}
interface IProps {
  userStore: UserStore
}

const Label = styled.label`
  font-size: ${theme.fontSizes[2] + 'px'};
  margin-bottom: ${theme.space[2] + 'px'};
  display: block;
`

export class ChangeEmailForm extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = { formValues: {} }
    this.getUserEmail()
  }

  public async submit(values: IFormValues) {
    const { password, newEmail } = values
    if (password && newEmail) {
      try {
        await this.props.userStore.changeUserEmail(password, newEmail)
        this.setState({
          msg: 'Email changed',
          formValues: {},
          errorMsg: undefined,
          showChangeEmailForm: false,
        })
        this.getUserEmail()
      } catch (error) {
        this.setState({ errorMsg: error.message, formValues: {} })
      }
    }
  }

  public async getUserEmail() {
    const email = await this.props.userStore.getUserEmail()
    this.setState({ email: email })
  }

  public render() {
    return (
      <>
        <Button
          my={3}
          variant={'secondary'}
          onClick={() =>
            this.setState({
              showChangeEmailForm: !this.state.showChangeEmailForm,
            })
          }
        >
            Change email
          </Button>
        {this.state.showChangeEmailForm && (
          <Form
            onSubmit={values => this.submit(values as IFormValues)}
            initialValues={this.state.formValues}
            render={({ submitting, values, handleSubmit }) => {
              const { password, newEmail } = values
              const disabled =
                submitting ||
                !password ||
                !newEmail ||
                newEmail === this.state.email
              return (
                <form onSubmit={handleSubmit}>
                  <Flex flexDirection={'column'} mb={3}>
                    <Text>Current email address: {this.state.email}</Text>
                  </Flex>
                  <Flex flexDirection={'column'} mb={3}>
                    <Label htmlFor="newEmail">New email address :</Label>
                    <Field
                      name="newEmail"
                      component={InputField}
                      placeholder="New email address"
                      type="email"
                      autocomplete="off"
                      required
                    />
                  </Flex>
                  <Flex flexDirection={'column'} mb={3}>
                    <Label htmlFor="oldPassword">Password :</Label>
                    <Field
                      name="password"
                      component={InputField}
                      placeholder="password"
                      type="password"
                      autocomplete="off"
                      required
                    />
                  </Flex>
                  <Button
                    type="submit"
                    disabled={disabled}
                    variant={disabled ? 'primary' : 'primary'}
                  >
                    Submit
                  </Button>
                  <Text color="error">{this.state.errorMsg}</Text>
                </form>
              )
            }}
          />
        )}
        <Text>{this.state.msg}</Text>
      </>
    )
  }
}
