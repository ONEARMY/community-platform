import { Component } from 'react'
import theme from 'src/themes/styled.theme'
import styled from '@emotion/styled'
import { Box } from 'rebass'
import { inject, observer } from 'mobx-react'
import Flex from 'src/components/Flex'
import { NotificationList } from 'src/components/Notifications/NotificationList'
import { Button } from 'oa-components'
import { UserStore } from 'src/stores/User/user.store'


interface IProps {
}

interface IInjectedProps extends IProps {
  userStore: UserStore
}
const PanelContainer = styled(Box)`
  width: 100%;
  position: absolute;
  left: 0;
  right: 0;
  display: block;
  z-index: ${theme.zIndex.header};
  height: 100%;
`

const PanelMenu = styled(Box)`
  background-color: ${theme.colors.white};
  display: flex;
  justify-content: flex-end;
  align-items: center;
  display: block !important;
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  overflow: visible;
  min-width: 200px;
`
export const PanelItem = styled(Box as any)`
  padding: ${theme.space[3]}px 0px;
`

export const MenuMobileLinkContainer = styled(Box as any)`
  border-top: 1px solid ${theme.colors.lightgrey};
  border-bottom: 1px solid ${theme.colors.lightgrey};
  margin-top: 5px;
`

const ModalContainerInner = styled(Box)`
  position: relative;
  background: white;
  border: 2px solid black;
  border-radius: 5px;
  margin: 1em;
  overflow-y: auto;
`

const ModalItem = styled(Box)`
  display: flex;
  flex-direction: column;
  color: #000;
  padding: 10px 30px 10px 30px;
  text-align: center;
  width: 100%;
  }
`

@inject('userStore')
@observer
export class NotificationsMobile extends Component {
  get injected() {
    return this.props as IInjectedProps
  }

  render() {
    const user = this.injected.userStore.user;
    const notifications = user?.notifications?.
      filter(notification => !notification.read).
      sort((a, b) => new Date(b._created).getTime() -  new Date(a._created).getTime());

    return (
      <>
        <PanelContainer>
          <PanelMenu>
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
                  <ModalItem style={{ textAlign: "center" }}>
                    Notifications
                  </ModalItem>
                </Flex>
                <Flex>
                  <ModalItem>
                    <NotificationList notifications={notifications} />
                  </ModalItem>
                </Flex>
                <Flex>
                  <Button variant="subtle" fontSize="14px"
                    style={{ margin: "0 auto 1em auto", borderRadius: "10px" }}
                    data-cy="clear-notifications"
                    onClick={() => this.injected.userStore.markAllNotificationsRead()}>
                      Clear notifications
                  </Button>
                </Flex>
              </ModalContainerInner>
            }
          </PanelMenu>
        </PanelContainer>
      </>
    )
  }
}

export default NotificationsMobile
