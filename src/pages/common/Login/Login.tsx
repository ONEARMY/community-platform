import * as React from 'react'
import IconButton from '@material-ui/core/IconButton'
import Modal from '@material-ui/core/Modal'
import Lock from '@material-ui/icons/Lock'
import LockOpen from '@material-ui/icons/LockOpen'
import { LoginFormComponent } from './LoginForm'
import { auth } from '../../../utils/firebase'
import { IUser } from '../../../models/models'

const styles: any = {
  container: {
    float: 'right',
    padding: '5px',
  },
}

interface IProps {
  user?: IUser | null
}

interface IState {
  showLoginModal: boolean
}

export class LoginComponent extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      showLoginModal: false,
    }
  }
  public componentWillReceiveProps(newProps: IProps) {
    if (newProps.user) {
      this.closeLogin()
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
  public closeLogin = () => {
    this.setState({
      showLoginModal: false,
    })
  }
  public render() {
    return (
      <div>
        <div style={styles.container}>
          <div className="login-icon">
            {this.props.user ? (
              <IconButton color="primary" onClick={this.logout}>
                <LockOpen />
                Log out
              </IconButton>
            ) : (
              <IconButton color="primary" onClick={this.openLogin}>
                <Lock />
                Log in
              </IconButton>
            )}
          </div>
        </div>
        <Modal
          aria-labelledby="user-login-modal"
          aria-describedby="click to show user login"
          open={this.state.showLoginModal && !this.props.user}
          onClose={this.closeLogin}
        >
          <div className="login-modal">
            <LoginFormComponent />
          </div>
        </Modal>
      </div>
    )
  }
}
