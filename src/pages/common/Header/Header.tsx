import { Component } from 'react'
import { Flex } from 'theme-ui'
import styled from '@emotion/styled'
import Profile from 'src/pages/common/Header/Menu/Profile/Profile'
import { NotificationsIcon } from 'src/pages/common/Header/Menu/Notifications/NotificationsIcon'
import { NotificationsDesktop } from 'src/pages/common/Header/Menu/Notifications/NotificationsDesktop'
import { NotificationsMobile } from 'src/pages/common/Header/Menu/Notifications/NotificationsMobile'
import MenuDesktop from 'src/pages/common/Header/Menu/MenuDesktop'
import MenuMobilePanel from 'src/pages/common/Header/Menu/MenuMobile/MenuMobilePanel'
import { motion } from 'framer-motion'
import Logo from 'src/pages/common/Header/Menu/Logo/Logo'
import theme from 'src/themes/styled.theme'
import HamburgerMenu from 'react-hamburger-menu'
import { observer, inject } from 'mobx-react'
import type { MobileMenuStore } from 'src/stores/MobileMenu/mobilemenu.store'
import type { UserStore } from 'src/stores/User/user.store'
import { isModuleSupported, MODULE } from 'src/modules'
import { getFormattedNotifications } from './getFormattedNotifications'

interface IInjectedProps {
  mobileMenuStore: MobileMenuStore
  userStore: UserStore
}

const MobileNotificationsWrapper = styled(Flex)`
  position: relative;

  @media only screen and (max-width: ${theme.breakpoints[1]}) {
    display: flex;
    margin-left: 1em;
    margin-right: auto;
  }

  @media only screen and (min-width: ${theme.breakpoints[1]}) {
    display: none;
  }
`

const MobileMenuWrapper = styled(Flex)`
  position: relative;

  @media only screen and (max-width: ${theme.breakpoints[1]}) {
    display: flex;
  }

  @media only screen and (min-width: ${theme.breakpoints[1]}) {
    display: none;
  }
`
const DesktopMenuWrapper = styled(Flex)`
  position: relative;

  @media only screen and (max-width: ${theme.breakpoints[1]}) {
    display: none;
  }

  @media only screen and (min-width: ${theme.breakpoints[1]}) {
    display: flex;
  }
`

const AnimationContainer = (props: any) => {
  const variants = {
    visible: {
      duration: 0.25,
      top: '0',
    },
    hidden: {
      duration: 0.25,
      top: '-100%',
    },
  }
  return (
    <motion.div
      layout
      style={{ position: 'relative' }}
      initial="hidden"
      animate="visible"
      variants={variants}
    >
      {props.children}
    </motion.div>
  )
}

@inject('mobileMenuStore')
@inject('userStore')
@observer
export class Header extends Component {
  // eslint-disable-next-line
  constructor(props: any) {
    super(props)
  }

  get injected() {
    return this.props as IInjectedProps
  }

  render() {
    const menu = this.injected.mobileMenuStore
    const user = this.injected.userStore.user
    const notifications = getFormattedNotifications(this.injected.userStore)
    const areThereNotifications = Boolean(notifications.length)
    const isLoggedInUser = !!user

    return (
      <>
        <Flex
          data-cy="header"
          bg="white"
          pl={[4, 4, 0]}
          pr={[4, 4, 0]}
          sx={{
            zIndex: theme.zIndex.header,
            position: 'relative',
            justifyContent: 'space-between',
            alignItems: 'center',
            minHeight: [null, null, 80],
          }}
        >
          <Flex>
            <Logo isMobile={true} />
          </Flex>
          {isLoggedInUser && (
            <MobileNotificationsWrapper>
              <NotificationsIcon
                onCLick={() => menu.toggleMobileNotifications()}
                isMobileMenuActive={menu.showMobileNotifications}
                areThereNotifications={areThereNotifications}
              />
            </MobileNotificationsWrapper>
          )}
          <DesktopMenuWrapper className="menu-desktop" px={2}>
            <MenuDesktop />
            {isLoggedInUser && (
              <>
                <NotificationsDesktop
                  notifications={notifications}
                  handleOnClick={() =>
                    this.injected.userStore.markAllNotificationsRead()
                  }
                />
              </>
            )}
            {isModuleSupported(MODULE.USER) && <Profile isMobile={false} />}
          </DesktopMenuWrapper>
          <MobileMenuWrapper className="menu-mobile">
            <Flex pl={5}>
              <HamburgerMenu
                isOpen={menu.showMobilePanel || false}
                menuClicked={() => menu.toggleMobilePanel()}
                width={18}
                height={15}
                strokeWidth={1}
                rotate={0}
                color="black"
                borderRadius={0}
                animationDuration={0.3}
              />
            </Flex>
          </MobileMenuWrapper>
        </Flex>
        {menu.showMobilePanel && (
          <AnimationContainer key={'mobilePanelContainer'}>
            <MobileMenuWrapper>
              <MenuMobilePanel />
            </MobileMenuWrapper>
          </AnimationContainer>
        )}
        {menu.showMobileNotifications && (
          <AnimationContainer key={'mobileNotificationsContainer'}>
            <MobileMenuWrapper>
              <NotificationsMobile
                notifications={notifications}
                handleOnClick={() =>
                  this.injected.userStore.markAllNotificationsRead()
                }
              />
            </MobileMenuWrapper>
          </AnimationContainer>
        )}
      </>
    )
  }
}

export default Header
