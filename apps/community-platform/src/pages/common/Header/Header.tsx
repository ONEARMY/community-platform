import React from 'react'
import { useTheme, withTheme } from '@emotion/react'
import { Button } from '@onearmy.apps/components'
import { UserRole } from '@onearmy.apps/shared'
import { motion } from 'framer-motion'
import { observer } from 'mobx-react'
import { Flex, Text } from 'theme-ui'

import { useCommonStores } from '../../../common/hooks/useCommonStores'
import { isModuleSupported, MODULE } from '../../../modules'
import Logo from '../../../pages/common/Header/Menu/Logo/Logo'
import MenuDesktop from '../../../pages/common/Header/Menu/MenuDesktop'
import MenuMobilePanel from '../../../pages/common/Header/Menu/MenuMobile/MenuMobilePanel'
import { NotificationsDesktop } from '../../../pages/common/Header/Menu/Notifications/NotificationsDesktop'
import { NotificationsIcon } from '../../../pages/common/Header/Menu/Notifications/NotificationsIcon'
import { NotificationsMobile } from '../../../pages/common/Header/Menu/Notifications/NotificationsMobile'
import Profile from '../../../pages/common/Header/Menu/Profile/Profile'
import { getFormattedNotifications } from './getFormattedNotifications'
import { MobileMenuContext } from './MobileMenuContext'

import type { ThemeWithName } from '@onearmy.apps/themes'

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
  const { userNotificationsStore } = useCommonStores().stores
  const user = userNotificationsStore.user
  const notifications = getFormattedNotifications(
    userNotificationsStore.getUnreadNotifications(),
  )
  const [showMobileNotifications, setShowMobileNotifications] =
    React.useState(false)
  const areThereNotifications = Boolean(notifications.length)
  const isLoggedInUser = !!user
  const [isVisible, setIsVisible] = React.useState(false)

  return (
    <MobileMenuContext.Provider
      value={{
        isVisible,
        setIsVisible,
      }}
    >
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
          {isLoggedInUser &&
            (user.userRoles || []).includes(UserRole.BETA_TESTER) && (
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
              onCLick={() =>
                setShowMobileNotifications(!showMobileNotifications)
              }
              isMobileMenuActive={showMobileNotifications}
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
            <NotificationsDesktop
              notifications={notifications}
              markAllRead={() =>
                userNotificationsStore.markAllNotificationsRead()
              }
              markAllNotified={() =>
                userNotificationsStore.markAllNotificationsNotified()
              }
            />
          )}
          {isModuleSupported(MODULE.USER) && <Profile isMobile={false} />}
        </Flex>
        <MobileMenuWrapper className="menu-mobile">
          <Flex pl={5}>
            <Button
              showIconOnly={true}
              icon={isVisible ? 'close' : 'menu'}
              onClick={() => setIsVisible(!isVisible)}
              large={true}
              mr={-3}
              sx={{
                bg: 'white',
                borderWidth: '0px',
                '&:hover': {
                  bg: 'white',
                },
                '&:active': {
                  bg: 'white',
                },
              }}
            />
          </Flex>
        </MobileMenuWrapper>
      </Flex>
      {isVisible && (
        <AnimationContainer key={'mobilePanelContainer'}>
          <MobileMenuWrapper>
            <MenuMobilePanel />
          </MobileMenuWrapper>
        </AnimationContainer>
      )}
      {showMobileNotifications && (
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
    </MobileMenuContext.Provider>
  )
})

export default withTheme(Header)
