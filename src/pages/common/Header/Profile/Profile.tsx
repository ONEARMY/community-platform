import React from 'react'
import { NavLink } from 'react-router-dom'
import { COMMUNITY_PAGES_PROFILE } from 'src/pages/PageList'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import { LoginComponent } from 'src/pages/common/Login/Login'
import { UserStore } from 'src/stores/User/user.store'
import { inject, observer } from 'mobx-react'
import Text from 'src/components/Text'
import { Flex } from 'rebass'
import { Avatar } from 'src/components/Avatar'

interface IState {
  moreMenuAnchor: any
  profileMenuAnchor: any
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
      moreMenuAnchor: null,
      profileMenuAnchor: null,
    }
  }
  get injected() {
    return this.props as IInjectedProps
  }

  // function receives clicked element which then sets itself as an 'anchor'
  // for displaying the dropdown menu
  openMoreMenu = (e: React.MouseEvent) => {
    this.setState({
      moreMenuAnchor: e.currentTarget,
    })
  }

  closeMoreMenu = () => {
    this.setState({ moreMenuAnchor: null })
  }

  openProfileMenu = (e: React.MouseEvent) => {
    this.setState({
      profileMenuAnchor: e.currentTarget,
    })
  }
  closeProfileMenu = () => {
    this.setState({ profileMenuAnchor: null })
  }

  logout() {
    this.injected.userStore.logout()
    this.closeProfileMenu()
  }

  render() {
    const { profileMenuAnchor } = this.state
    const user = this.injected.userStore.user
    return (
      <>
        {user ? (
          <>
            <Flex onClick={this.openProfileMenu} ml={1}>
              <Avatar userName={user.userName} />
            </Flex>
            <Menu
              open={profileMenuAnchor ? true : false}
              anchorEl={profileMenuAnchor}
            >
              <ClickAwayListener onClickAway={this.closeProfileMenu}>
                <>
                  <Text bold>{user.userName}</Text>
                  <MenuItem onClick={this.closeProfileMenu}>
                    <NavLink to={'/u/' + user.userName}>
                      <Flex>Profile</Flex>
                    </NavLink>
                  </MenuItem>
                  {COMMUNITY_PAGES_PROFILE.map(page => (
                    <MenuItem onClick={this.closeProfileMenu} key={page.path}>
                      <NavLink to={page.path}>
                        <Flex>{page.title}</Flex>
                      </NavLink>
                    </MenuItem>
                  ))}
                  <MenuItem onClick={() => this.logout()}>Logout</MenuItem>
                </>
              </ClickAwayListener>
            </Menu>
          </>
        ) : (
          <LoginComponent />
        )}
      </>
    )
  }
}
