import React from 'react'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import { LoginComponent } from 'src/pages/common/Login/Login'
import { UserStore } from 'src/stores/User/user.store'
import { inject, observer } from 'mobx-react'
import Flex from 'src/components/Flex'
import { Avatar } from 'src/components/Avatar'
import { ProfileModal } from 'src/components/ProfileModal/ProfileModal'
import styled from 'styled-components'
import theme from 'src/themes/styled.theme'
import { Box } from 'rebass'
import MenuMobileLinkItem from 'src/pages/common/Header/Menu/MenuMobile/MenuMobileLinkItem'
import ProfileButtons from './ProfileButtons'

interface IState {
  showProfileModal: boolean
}

interface IProps {
  isMobile: boolean
}

interface IInjectedProps extends IProps {
  userStore: UserStore
}

const PanelItem = styled(Box)`
  padding: ${theme.space[3]}px 0px;
`
@inject('userStore')
@observer
export default class Profile extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      showProfileModal: false,
    }
  }
  get injected() {
    return this.props as IInjectedProps
  }

  toggleProfileModal() {
    this.setState({ showProfileModal: !this.state.showProfileModal })
  }

  render() {
    const user = this.injected.userStore.user
    const { showProfileModal } = this.state
    return (
      <>
        {user ? (
          this.props.isMobile ? (
            <MenuMobileLinkItem
              path={'/u/' + user.userName}
              content={'My profile'}
            />
          ) : (
            <div data-cy="user-menu">
              <Flex onClick={() => this.toggleProfileModal()} ml={1}>
                <Avatar userName={user.userName} />
              </Flex>
              <Flex>
                {showProfileModal && (
                  <ClickAwayListener
                    onClickAway={() => this.toggleProfileModal()}
                  >
                    <ProfileModal username={user.userName} />
                  </ClickAwayListener>
                )}
              </Flex>
            </div>
          )
        ) : this.props.isMobile ? (
          <ProfileButtons isMobile={true} />
        ) : (
          // once LoginComponent is removed, this will become more readable
          <LoginComponent />
        )}
      </>
    )
  }
}
