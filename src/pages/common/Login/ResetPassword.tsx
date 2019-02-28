import * as React from 'react'
import { inject } from 'mobx-react'
import { Form, Field } from 'react-final-form'
import { Button } from 'src/components/Button'
import { InputField } from 'src/components/Form/Fields'
import { Main, ModalPaper } from './elements'
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
export class ResetPasswordComponent extends React.Component<IProps, IState> {
  public state: IState = {
    email: '',
  }

  get injected() {
    return this.props as InjectedProps
  }

  public onSubmit = async values => {
    try {
      await this.injected.userStore.sendPasswordResetEmail(values.email)
      this.setState({
        message: 'Reset password email has been sent to your email address.',
      })
    } catch (error) {
      this.setState({
        message: error,
      })
    }
  }

  public render() {
    return (
      <Main>
        <ModalPaper>
          {
            this.state.message ? (
              <div>
                <p>{this.state.message}</p>
                <Button onClick={this.props.closeLogin}>
                  Close
                </Button>
              </div>
              ) : (
              <Form
                onSubmit={values => this.onSubmit(values)}
                initialValues={this.state}
                render={({ handleSubmit, submitting, invalid }) => {
                  return (
                    <div>
                      <form onSubmit={handleSubmit}>
                        <Field
                          name="email"
                          component={InputField}
                          label="Email"
                          type="email"
                          required
                        />
                        <Button
                          type="submit"
                          icon={'check'}
                          disabled={submitting || invalid}
                        >
                          Submit
                        </Button>
                      </form>
                    </div>
                  )
                }}
              />
            )
          }
        </ModalPaper>
      </Main>
    )
  }
}
