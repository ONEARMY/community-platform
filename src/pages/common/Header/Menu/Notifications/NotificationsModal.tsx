import * as React from 'react'
import { Box } from 'rebass'
import styled from 'styled-components'
import { UserStore } from 'src/stores/User/user.store'
import { inject, observer } from 'mobx-react'
import Flex from 'src/components/Flex'
import { NotificationList } from 'src/components/Notifications/NotificationList'


interface IProps { 
}

interface IInjectedProps extends IProps {
  userStore: UserStore,
}

const ModalContainer = styled(Box)`
  max-width: 100%;
  max-height: 100%;
  position: absolute;
  right: 10px;
  top: 60px;
  height: 100%;
`
const ModalContainerInner = styled(Box)`
  position: relative;
  background: white;
  border: 2px solid black;
  border-radius: 5px;
  margin: 1em;
`

const ModalItem = styled(Box)`
  display: flex;
  flex-direction: column;
  color: #000;
  padding: 10px 30px 10px 30px;
  text-align: left;
  width: 100%;
  max-width: 100%;
  max-height: 100%;
  }
`
@inject('userStore')
@observer
export class NotificationsModal extends React.Component<IProps> {
  // eslint-disable-nthis.injected.userStore.userext-line
  constructor(props: IProps) {
    super(props)
  }

  get injected() {
    return this.props as IInjectedProps
  }


  render() {
    const user = this.injected.userStore.user;
    const notifications = user?.notifications;

    return (
      <ModalContainer data-cy="user-menu-list">
        {!notifications || notifications?.length === 0 ?
          <ModalContainerInner>
            <Flex>
              <ModalItem>
                Nada, no new notification
              </ModalItem>
            </Flex>
          </ModalContainerInner>
          : <ModalContainerInner>
            <Flex>
              <ModalItem>
                Notifications
              </ModalItem>
            </Flex>
            <Flex>
              <NotificationList notifications={notifications} />
            </Flex>
            <Flex>
              <button>Clear notifications</button>
            </Flex>
          </ModalContainerInner>
        }
      </ModalContainer>
    )
  }
}
