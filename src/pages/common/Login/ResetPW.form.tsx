import * as React from 'react'
import { Button } from 'src/components/Button'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'
import { UserStore } from 'src/stores/User/user.store'
import { Form } from 'react-final-form'
import { Typography } from '@material-ui/core'
import Text from 'src/components/Text'
import Heading from 'src/components/Heading'

interface IFormValues {
  email: string
}
interface IState {
  formValues: IFormValues
  msg?: string
  disabled?: boolean
}
interface IProps {
  onChange: (e: React.FormEvent<any>) => void
  userStore: UserStore
  preloadValues?: any
}

/************** Notes on 10/1/19 : *******************/
/************** DEPPRECATED *******************/
/************** Login and Sign in is now handled in src/pages/SignIn and src/pages/SignUp */
/************** Keeping this component to implement reset password and then will delete */

export class ResetPWForm extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      // if passed form values from props initially populate
      formValues: {
        email: props.preloadValues ? props.preloadValues.email : '',
      },
    }
  }

  // track change internally for validation and emit to parent for processing
  handleChange(e: React.FormEvent<any>) {
    const nextValues = { ...this.state.formValues }
    nextValues[e.currentTarget.id] = e.currentTarget.value
    this.setState({ formValues: nextValues })
    this.props.onChange(e)
  }

  public async resetPW(e) {
    e.preventDefault()
    this.setState({ disabled: true })
    await this.props.userStore.sendPasswordResetEmail(
      this.state.formValues.email,
    )
    this.setState({
      msg: 'Reset password email has been sent to your email address.',
    })
  }
  public render() {
    console.log('render', this.state.formValues)
    const disabled = this.state.disabled || this.state.formValues.email === ''
    return (
      <Form
        onSubmit={e => this.resetPW(e)}
        initialValues={this.state.formValues}
        render={({ values }) => (
          <form>
            <Heading medium mb={3} textAlign="center">
              Welcome Back
            </Heading>
            <Text medium bold mb={3} textAlign="center">
              Reset your password
            </Text>
            <Text medium mb={3} textAlign="center">
              Enter your email address and we'll send you a reset password link
              to your email address
            </Text>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Email Address</InputLabel>
              <Input
                id="email"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={e => this.handleChange(e)}
                // for some reason not rendering automatically so adding as extra value field here
                value={values.email}
              />
            </FormControl>
            <Button
              type="submit"
              width={1}
              variant={disabled ? 'disabled' : 'dark'}
              mt={3}
              disabled={disabled}
              onClick={e => this.resetPW(e)}
            >
              Reset password
            </Button>
            <Typography color="error" variant="caption">
              {this.state.msg}
            </Typography>
          </form>
        )}
      />
    )
  }
}
