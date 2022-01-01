import { Component } from 'react'
import { UserStore } from 'src/stores/User/user.store'
import { inject, observer } from 'mobx-react'
import Flex from 'src/components/Flex'
import Icon from 'src/components/Icons'
import { NotificationsModal } from './NotificationsModal'
import NotificationsIcon from './NotificationsIcon'


interface IState {
  showNotificationsModal: boolean
}

interface IProps {
  isMobile: boolean
}

interface IInjectedProps extends IProps {
  userStore: UserStore
}

@inject('userStore')
@observer
export default class Notifications extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      showNotificationsModal: false,
    }
  }
  get injected() {
    return this.props as IInjectedProps
  }

  toggleNotificationsModal() {
    this.setState({ showNotificationsModal: !this.state.showNotificationsModal })
  }

  render() {
    const user = this.injected.userStore.user;
    const showNotificationsModal = this.state;

    return (
      <>
        {user ? (
          this.props.isMobile ? (
            ""
          ) : (
            <div>
              <NotificationsIcon onCLick={() => this.toggleNotificationsModal()}/>
              <Flex>
                {showNotificationsModal && (
                    <NotificationsModal/>
                )}
              </Flex>
            </div>
          )
        ) : ""
        }
      </>
    )
  }
}
