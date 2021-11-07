import * as React from 'react'
import { Box } from 'rebass'
import styled from 'styled-components'
import { UserStore } from 'src/stores/User/user.store'
import { inject, observer } from 'mobx-react'
import { COMMUNITY_PAGES_PROFILE } from 'src/pages/PageList'
import { NavLink } from 'react-router-dom'
import Flex from 'src/components/Flex'
import theme, { zIndex } from 'src/themes/styled.theme'
import { INotification, IUser } from 'src/models/user.models'
import { NotificationList } from 'src/components/Notifications/NotificationList'


interface IProps {}

interface IInjectedProps extends IProps {
  userStore: UserStore
}

const ModalContainer = styled(Box)`
  max-width: 100%;
  max-height: 100%;
  position: absolute;
  right: 10px;
  top: 60px;
  z-index: ${zIndex.modalProfile};
  height: 100%;
`
const ModalContainerInner = styled(Box)`
  z-index: ${zIndex.modalProfile};
  position: relative;
  background: white;
  border: 2px solid black;
  border-radius: 5px;
`

const ModalItem = styled(Box)`
  z-index: ${zIndex.modalProfile};
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
    const user = this.injected.userStore.user
    const notifications = user?.notifications;
    
    return (
      <ModalContainer data-cy="user-menu-list">
        <ModalContainerInner>
          <Flex>
            <ModalItem>
              Notifications
            </ModalItem>
          </Flex>
          <Flex>
            <NotificationList notifications={notifications}/>
          </Flex>
        </ModalContainerInner>
      </ModalContainer>
    )
  }
}
