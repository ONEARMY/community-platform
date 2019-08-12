import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  COMMUNITY_PAGES,
  COMMUNITY_PAGES_MORE,
  COMMUNITY_PAGES_PROFILE,
} from 'src/pages/PageList'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import { LoginComponent } from '../../Login/Login'
import { UserStore } from 'src/stores/User/user.store'
import { inject, observer } from 'mobx-react'
import Text from 'src/components/Text'
import theme from 'src/themes/styled.theme'
import { Link, Flex, Image } from 'rebass'
import styled from 'styled-components'
import { SITE, VERSION } from 'src/config/config'
import { DHImport } from '../../../../hacks/DaveHakkensNL.hacks'
import Logo from 'src/assets/images/logo.svg'
import LogoBackground from 'src/assets/images/logo-background.svg'
import MenuCurrent from 'src/assets/images/menu-current.svg'

interface IState {
  moreMenuAnchor: any
  profileMenuAnchor: any
}

interface IProps {
  title: string
  description: string
}

interface IInjectedProps extends IProps {
  userStore: UserStore
}

const FlexHeader = styled(Flex)`
  height: 60px;
`

const Avatar = styled.div`
  display: block;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-color: ${theme.colors.background};
`

const LogoImage = styled(Flex)`
  width: 45px;
  height: 45px;
  margin-right: 20px;
`

const LogoContainer = styled(Flex)`
  height: 60px;
  background-color: ${theme.colors.yellow};
  align-items: center;
  position:relative &:before {
    content: '';
    position: absolute;
    background-image: url(${LogoBackground});
    width: 250px;
    height: 70px;
    z-index: 999;
    background-size: contain;
    background-repeat: no-repeat;
    top: 0;
    left: 0px;
  }
`

const LogoLink = styled(Link)`
  z-index: 9999;
  display: flex;
  align-items: center;
  padding-left: 25px;
  color: black;
`

const MenuLink = styled(NavLink).attrs(({ name }) => ({
  activeClassName: 'current',
}))`
  color: ${theme.colors.black};
  position: relative > div {
    z-index: 1;
    position: relative;

    &:hover {
      opacity: 0.7;
    }
  }
  &.current {
    &:after {
      content: '';
      width: 70px;
      height: 20px;
      display: block;
      position: absolute;
      bottom: -6px;
      background-image: url(${MenuCurrent});
      z-index: 0;
      background-repeat: no-repeat;
      background-size: contain;
      left: 50%;
      transform: translateX(-50%);
    }
  }
`

@inject('userStore')
@observer
export class CommunityHeader extends React.Component<IProps, IState> {
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

  openProfileMenu = (e: React.MouseEvent) => {
    this.setState({
      profileMenuAnchor: e.currentTarget,
    })
  }
  closeMoreMenu = () => {
    this.setState({ moreMenuAnchor: null })
  }
  closeProfileMenu = () => {
    this.setState({ profileMenuAnchor: null })
  }

  logout() {
    this.injected.userStore.logout()
    this.closeProfileMenu()
  }

  render() {
    const { moreMenuAnchor, profileMenuAnchor } = this.state
    const user = this.injected.userStore.user
    return (
      <>
        <FlexHeader
          alignItems={'center'}
          justifyContent={'space-between'}
          bg={'white'}
        >
          <LogoContainer>
            <LogoLink href="/">
              <LogoImage>
                <Image src={Logo} color={'black'} />
              </LogoImage>
              <Flex>Precious Plastic</Flex>
            </LogoLink>
          </LogoContainer>

          <Flex>
            <Flex alignItems={'center'} px={2}>
              {COMMUNITY_PAGES.map(page => (
                <Flex mx={5}>
                  <MenuLink to={page.path} key={page.path}>
                    <Flex>{page.title}</Flex>
                  </MenuLink>
                </Flex>
              ))}
            </Flex>
            {user ? (
              <>
                <Flex onClick={this.openProfileMenu} ml={5} mr={5}>
                  <Avatar />
                </Flex>
                <Menu
                  open={profileMenuAnchor ? true : false}
                  anchorEl={profileMenuAnchor}
                >
                  <ClickAwayListener onClickAway={this.closeProfileMenu}>
                    <>
                      <Text p={8} bold>
                        {user.userName}
                      </Text>
                      {COMMUNITY_PAGES_PROFILE.map(page => (
                        <MenuItem
                          onClick={this.closeProfileMenu}
                          key={page.path}
                        >
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
          </Flex>
        </FlexHeader>
      </>
    )
  }
}
