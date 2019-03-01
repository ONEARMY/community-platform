import * as React from 'react'
import Modal from '@material-ui/core/Modal'
import { LoginFormComponent } from './LoginForm'
import { ResetPasswordComponent } from './ResetPassword'
import { IUser } from 'src/models/user.models'
import { auth } from 'src/utils/firebase'
import { Button } from 'src/components/Button'

interface IProps {
  user?: IUser | null
}

interface IState {
  showLoginModal: boolean
  showResetModal: boolean
}

export class LoginComponent extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      showLoginModal: false,
      showResetModal: false,
    }
  }
  public logout = () => {
    auth.signOut()
  }
  public openLogin = () => {
    if (!this.props.user) {
      this.setState({
        showLoginModal: true,
      })
    }
  }
  public openReset = () => {
    this.setState({
      showResetModal: true,
    })
  }
  public closeLogin = () => {
    this.setState({
      showLoginModal: false,
      showResetModal: false,
    })
  }
  public render() {
    return (
      <>
        <Button onClick={this.openLogin}>Log in</Button>
        <Modal
          aria-labelledby="user-login-modal"
          aria-describedby="click to show user login"
          open={this.state.showLoginModal && !this.props.user}
          onClose={this.closeLogin}
        >
          <div className="login-modal">
            {
              !this.state.showResetModal ?
                <LoginFormComponent closeLogin={this.closeLogin} openReset={this.openReset} />
              :
                <ResetPasswordComponent closeLogin={this.closeLogin} />
            }
          </div>
        </Modal>
      </>
    )
  }
}
