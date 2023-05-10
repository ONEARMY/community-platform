import { Button, FieldInput } from 'oa-components'
import { preciousPlasticTheme } from 'oa-themes'
import * as React from 'react'
import { Field, Form } from 'react-final-form'
import type { UserStore } from 'src/stores/User/user.store'
import { Flex, Text } from 'theme-ui'
// TODO: Remove direct usage of Theme
const theme = preciousPlasticTheme.styles
import styled from '@emotion/styled'

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
          mr={2}
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
            onSubmit={(values) => this.submit(values as IFormValues)}
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
                  <Flex sx={{ flexDirection: 'column' }} mb={3}>
                    <Text>Current email address: {this.state.email}</Text>
                  </Flex>
                  <Flex sx={{ flexDirection: 'column' }} mb={3}>
                    <Label htmlFor="newEmail">New email address :</Label>
                    <Field
                      name="newEmail"
                      component={FieldInput}
                      placeholder="New email address"
                      type="email"
                      autocomplete="off"
                      required
                    />
                  </Flex>
                  <Flex sx={{ flexDirection: 'column' }} mb={3}>
                    <Label htmlFor="oldPassword">Password :</Label>
                    <Field
                      name="password"
                      component={FieldInput}
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
