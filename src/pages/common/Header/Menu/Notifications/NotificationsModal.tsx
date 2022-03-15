import * as React from 'react'
import { Box } from 'rebass'
import styled from '@emotion/styled'
import { UserStore } from 'src/stores/User/user.store'
import { inject, observer } from 'mobx-react'
import Flex from 'src/components/Flex'
import { NotificationList } from 'src/components/Notifications/NotificationList'
import {
  Button
} from 'rebass'

interface IProps {
}

interface IInjectedProps extends IProps {
  userStore: UserStore,
}

const ModalContainer = styled(Box)`
  width: 250px;
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
  overflow-y: auto;
  padding: 10px 20px 10px;
  width: 248px;
  max-height: 310px;

`

const ModalItem = styled(Box)`
  display: flex;
  flex-direction: column;
  color: #000;
  width: 100%;
  font-size: 16px;
  }
`

@inject('userStore')
@observer
export class NotificationsModal extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props)
  }

  get injected() {
    return this.props as IInjectedProps
  }


  render() {
    const user = this.injected.userStore.user;
    const notifications = user?.notifications?.
      filter(notification => !notification.read).
      sort((a, b) => new Date(b._created).getTime() -  new Date(a._created).getTime());

    return (
      <ModalContainer data-cy="notifications-modal-desktop">
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
              <ModalItem style={{marginBottom: "20px"}}>
                Notifications
              </ModalItem>
            </Flex>
            <Flex>
              <NotificationList notifications={notifications} />
            </Flex>
            <Flex>
              <Button
                style={{width: "100%", borderRadius: '10px'}}
                variant="subtle"
                data-cy="clear-notifications"
                onClick={() => this.injected.userStore.markAllNotificationsRead()}>
                  <div style={{margin: "auto"}}>
                    Clear notifications
                  </div>
              </Button>
            </Flex>
          </ModalContainerInner>
        }
      </ModalContainer>
    )
  }
}
