import React from 'react'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import { LoginComponent } from 'src/pages/common/Login/Login'
import { UserStore } from 'src/stores/User/user.store'
import { inject, observer } from 'mobx-react'
import Flex from 'src/components/Flex'
import { Avatar } from 'src/components/Avatar'
import { ProfileModal } from 'src/components/ProfileModal/ProfileModal'

interface IState {
  showDeleteModal: boolean
}

interface IProps {}

interface IInjectedProps extends IProps {
  userStore: UserStore
}

@inject('userStore')
@observer
export default class Profile extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      showDeleteModal: false,
    }
  }
  get injected() {
    return this.props as IInjectedProps
  }

  toggleDeleteModal() {
    this.setState({ showDeleteModal: !this.state.showDeleteModal })
  }

  render() {
    const user = this.injected.userStore.user
    return (
      <>
        {user ? (
          <>
            <Flex onClick={() => this.toggleDeleteModal()} ml={1}>
              <Avatar userName={user.userName} />
            </Flex>
            <Flex>
              {this.state.showDeleteModal && (
                <ClickAwayListener onClickAway={() => this.toggleDeleteModal()}>
                  <ProfileModal username={user.userName} />
                </ClickAwayListener>
              )}
            </Flex>
          </>
        ) : (
          <LoginComponent />
        )}
      </>
    )
  }
}
