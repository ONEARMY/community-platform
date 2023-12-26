import React from 'react'
import { motion } from 'framer-motion'
import { observer } from 'mobx-react'
import HamburgerMenu from 'react-hamburger-menu'
import { Flex, Text } from 'theme-ui'
import { useTheme, withTheme } from '@emotion/react'

import Logo from 'src/pages/common/Header/Menu/Logo/Logo'
import MenuDesktop from 'src/pages/common/Header/Menu/MenuDesktop'
import MenuMobilePanel from 'src/pages/common/Header/Menu/MenuMobile/MenuMobilePanel'
import Profile from 'src/pages/common/Header/Menu/Profile/Profile'
import { isModuleSupported, MODULE } from 'src/modules'
import { NotificationsDesktop } from 'src/pages/common/Header/Menu/Notifications/NotificationsDesktop'
import { NotificationsIcon } from 'src/pages/common/Header/Menu/Notifications/NotificationsIcon'
import { NotificationsMobile } from 'src/pages/common/Header/Menu/Notifications/NotificationsMobile'
import { getFormattedNotifications } from './getFormattedNotifications'
import { useCommonStores } from 'src/index'

import type { ThemeWithName } from 'oa-themes'

const MobileNotificationsWrapper = ({ children }) => {
  const theme = useTheme()

  return (
    <Flex
      sx={{
        position: 'relative',
        [`@media only screen and (max-width: ${theme.breakpoints[1]})`]: {
          display: 'flex',
          marginLeft: '1em',
          marginRight: 'auto',
        },
        [`@media only screen and (min-width: ${theme.breakpoints[1]})`]: {
          display: 'none',
        },
      }}
    >
      {children}
    </Flex>
  )
}

const MobileMenuWrapper = ({ children, ...props }) => (
  <Flex
    {...props}
    sx={{ position: 'relative', display: ['flex', 'flex', 'none'] }}
  >
    {children}
  </Flex>
)

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

const Header = observer(({ theme }: { theme: ThemeWithName }) => {
  const { mobileMenuStore, userNotificationsStore } = useCommonStores().stores
  const user = userNotificationsStore.user
  const notifications = getFormattedNotifications(
    userNotificationsStore.getUnreadNotifications(),
  )
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
          <Flex>
            <Logo />
          </Flex>
          {isLoggedInUser && (user.userRoles || []).includes('beta-tester') && (
            <Flex
              className="user-beta-icon"
              ml={4}
              sx={{ alignItems: 'center' }}
            >
              <Text
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.4rem',
                  borderRadius: '4px',
                  padding: '2px 6px',
                  backgroundColor: 'lightgrey',
                }}
              >
                BETA
              </Text>
            </Flex>
          )}
        </Flex>
        {isLoggedInUser && (
          <MobileNotificationsWrapper>
            <NotificationsIcon
              onCLick={() => mobileMenuStore.toggleMobileNotifications()}
              isMobileMenuActive={mobileMenuStore.showMobileNotifications}
              areThereNotifications={areThereNotifications}
            />
          </MobileNotificationsWrapper>
        )}
        <Flex
          className="menu-desktop"
          px={2}
          sx={{
            position: 'relative',
            display: ['none', 'none', 'flex'],
          }}
        >
          <MenuDesktop />
          {isLoggedInUser && (
            <>
              <NotificationsDesktop
                notifications={notifications}
                markAllRead={() =>
                  userNotificationsStore.markAllNotificationsRead()
                }
                markAllNotified={() =>
                  userNotificationsStore.markAllNotificationsNotified()
                }
              />
            </>
          )}
          {isModuleSupported(MODULE.USER) && <Profile isMobile={false} />}
        </Flex>
        <MobileMenuWrapper className="menu-mobile">
          <Flex pl={5}>
            <HamburgerMenu
              isOpen={mobileMenuStore.showMobilePanel || false}
              menuClicked={() => mobileMenuStore.toggleMobilePanel()}
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
      {mobileMenuStore.showMobilePanel && (
        <AnimationContainer key={'mobilePanelContainer'}>
          <MobileMenuWrapper>
            <MenuMobilePanel />
          </MobileMenuWrapper>
        </AnimationContainer>
      )}
      {mobileMenuStore.showMobileNotifications && (
        <AnimationContainer key={'mobileNotificationsContainer'}>
          <MobileMenuWrapper>
            <NotificationsMobile
              notifications={notifications}
              markAllRead={() =>
                userNotificationsStore.markAllNotificationsRead()
              }
              markAllNotified={() =>
                userNotificationsStore.markAllNotificationsNotified()
              }
            />
          </MobileMenuWrapper>
        </AnimationContainer>
      )}
    </>
  )
})

export default withTheme(Header)
