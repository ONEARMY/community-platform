import React, { useContext } from 'react'
import { withTheme } from '@emotion/react'
import { motion } from 'framer-motion'
import { observer } from 'mobx-react'
import { Button } from 'oa-components'
import { UserRole } from 'oa-shared'
// eslint-disable-next-line import/no-unresolved
import { ClientOnly } from 'remix-utils/client-only'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { isModuleSupported, MODULE } from 'src/modules'
import Logo from 'src/pages/common/Header/Menu/Logo/Logo'
import MenuDesktop from 'src/pages/common/Header/Menu/MenuDesktop'
import MenuMobilePanel from 'src/pages/common/Header/Menu/MenuMobile/MenuMobilePanel'
import { NotificationsDesktop } from 'src/pages/common/Header/Menu/Notifications/NotificationsDesktop'
import { NotificationsIcon } from 'src/pages/common/Header/Menu/Notifications/NotificationsIcon'
import { NotificationsMobile } from 'src/pages/common/Header/Menu/Notifications/NotificationsMobile'
import Profile from 'src/pages/common/Header/Menu/Profile/Profile'
import { Flex, Text, useThemeUI } from 'theme-ui'

import { EnvironmentContext } from '../EnvironmentContext'
import { getFormattedNotifications } from './getFormattedNotifications'
import { MobileMenuContext } from './MobileMenuContext'

import type { ThemeWithName } from 'oa-themes'

const MobileNotificationsWrapper = ({ children }) => {
  const themeUi = useThemeUI()
  const theme = themeUi.theme as ThemeWithName

  return (
    <Flex
      sx={{
        position: 'relative',
        [`@media only screen and (max-width: ${theme.breakpoints![1]})`]: {
          display: 'flex',
          marginLeft: '1em',
          marginRight: 'auto',
        },
        [`@media only screen and (min-width: ${theme.breakpoints![1]})`]: {
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

const Header = observer(() => {
  const { theme } = useThemeUI()
  const env = useContext(EnvironmentContext)
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
        sx={{
          backgroundColor: 'white',
          px: [4, 4, 0],
          zIndex: (theme as any).zIndex.header,
          position: 'relative',
          justifyContent: 'space-between',
          alignItems: 'center',
          minHeight: [null, null, 80],
        }}
      >
        <Flex>
          <Logo />
          {isLoggedInUser &&
            (user.userRoles || []).includes(UserRole.BETA_TESTER) && (
              <Flex
                className="user-beta-icon"
                sx={{ alignItems: 'center', marginLeft: 4 }}
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
          sx={{
            px: 2,
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
          {isModuleSupported(env.VITE_SUPPORTED_MODULES || '', MODULE.USER) && (
            <Profile isMobile={false} />
          )}
        </Flex>
        <ClientOnly fallback={<></>}>
          {() => (
            <MobileMenuWrapper className="menu-mobile">
              <Flex sx={{ paddingLeft: 5 }}>
                <Button
                  type="button"
                  showIconOnly={true}
                  icon={isVisible ? 'close' : 'menu'}
                  onClick={() => setIsVisible(!isVisible)}
                  large={true}
                  sx={{
                    marginRight: -3,
                    backgroundColor: 'white',
                    borderWidth: '0px',
                    '&:hover': {
                      backgroundColor: 'white',
                    },
                    '&:active': {
                      backgroundColor: 'white',
                    },
                  }}
                />
              </Flex>
            </MobileMenuWrapper>
          )}
        </ClientOnly>
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
