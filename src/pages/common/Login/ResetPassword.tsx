import * as React from 'react'
import { inject } from 'mobx-react'
import { Text } from 'rebass'
import { Button } from 'src/components/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'
import Lock from '@material-ui/icons/Lock'
import { Main, ModalPaper, ModalAvatar, Form } from './elements'
import { UserStore } from 'src/stores/User/user.store'

interface IState {
  email: string
  message?: string
}

interface IProps {
  closeLogin: () => void
}

interface InjectedProps extends IProps {
  userStore: UserStore
}

@inject('userStore')
export class ResetPasswordComponent extends React.Component<IProps> {
  public state: IState = {
    email: '',
  }

  get injected() {
    return this.props as InjectedProps
  }

  public handleChange = (e: React.FormEvent<any>) => {
    this.setState({
      [e.currentTarget.id]: e.currentTarget.value,
    })
  }

  public onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
      await this.injected.userStore.sendPasswordResetEmail(this.state.email)
      this.setState({
        message: 'Reset password email has been sent to your email address.',
      })
    } catch (error) {
      console.log(error)
      this.setState({
        message: error.message,
      })
    }
  }

  public render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <Main>
          <ModalPaper>
            <ModalAvatar>
              <Lock />
            </ModalAvatar>
            {this.state.message ? (
              <>
                <Text m={3}>{this.state.message}</Text>
                <Button
                  onClick={this.props.closeLogin}
                  width={1}
                  variant="primary"
                  mt={3}
                >
                  Close
                </Button>
              </>
            ) : (
              <>
                <Text textAlign={'center'} m={3}>
                  Please enter the your email address.
                </Text>
                <Form onSubmit={this.onSubmit}>
                  <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="email">Email Address</InputLabel>
                    <Input
                      id="email"
                      name="email"
                      autoComplete="email"
                      autoFocus
                      onChange={this.handleChange}
                    />
                  </FormControl>
                  <Button type="submit" width={1} variant="primary" mt={3}>
                    Reset password
                  </Button>
                </Form>
              </>
            )}
          </ModalPaper>
        </Main>
      </React.Fragment>
    )
  }
}
