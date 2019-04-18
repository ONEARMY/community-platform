import * as React from 'react'
import Modal from '@material-ui/core/Modal'
import { LoginFormComponent } from './LoginForm'
import { ResetPasswordComponent } from './ResetPassword'
import { auth } from 'src/utils/firebase'
import { Button } from 'src/components/Button'
import { UserStore } from 'src/stores/User/user.store'
import { inject, observer } from 'mobx-react'

interface IProps {
  userStore?: UserStore
}

interface IState {
  showLoginModal: boolean
  showResetModal: boolean
}

interface InjectedProps extends IProps {
  userStore: UserStore
}

@inject('userStore')
@observer
export class LoginComponent extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      showLoginModal: false,
      showResetModal: false,
    }
  }

  public get injected() {
    return this.props as InjectedProps
  }

  public logout = () => {
    auth.signOut()
  }
  public openLogin = () => {
    if (!this.injected.userStore.user) {
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
    const user = this.injected.userStore.user
    console.log('login user', user)
    return (
      <>
        <Button onClick={this.openLogin}>Log in</Button>
        <Modal
          aria-labelledby="user-login-modal"
          aria-describedby="click to show user login"
          open={this.state.showLoginModal && !user}
          onClose={this.closeLogin}
        >
          <div className="login-modal">
            {!this.state.showResetModal ? (
              <LoginFormComponent
                closeLogin={this.closeLogin}
                openReset={this.openReset}
              />
            ) : (
              <ResetPasswordComponent closeLogin={this.closeLogin} />
            )}
          </div>
        </Modal>
      </>
    )
  }
}
