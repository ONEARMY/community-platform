import { Component } from 'react'
import { UserStore } from 'src/stores/User/user.store'
import { inject, observer } from 'mobx-react'
import Flex from 'src/components/Flex'
import { NotificationsModal } from './NotificationsModal'
import NotificationsIcon from './NotificationsIcon'
import Foco from 'react-foco'

interface IState {
  showNotificationsModal: boolean
}

interface IProps { }

interface IInjectedProps extends IProps {
  userStore: UserStore
}

@inject('userStore')
@observer
export default class NotificationsDesktop extends Component<IProps, IState> {
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
    this.setState({
      showNotificationsModal: !this.state.showNotificationsModal,
    })
  }

  render() {
    const user = this.injected.userStore.user
    const areThereNotifications = Boolean(
      user?.notifications?.length &&
      !(
        user?.notifications?.filter(notification => !notification.read)
          .length === 0
      ),
    )

    const showNotificationsModal = this.state.showNotificationsModal

    return (
      <>
        {user ? (
          <Foco onClickOutside={() => this.setState({
            showNotificationsModal: false
          })}>
            <div data-cy="notifications-desktop">
              <NotificationsIcon
                onCLick={() => this.toggleNotificationsModal()}
                isMobileMenuActive={false}
                areThereNotifications={areThereNotifications}
              />
              <Flex>
                {showNotificationsModal && (
                  <NotificationsModal />
                )}
              </Flex>
            </div>
          </Foco>
        ) : (
          ''
        )}
      </>
    )
  }
}
