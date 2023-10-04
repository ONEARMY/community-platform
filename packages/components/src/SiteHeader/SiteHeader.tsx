import { motion } from 'framer-motion'
import { useTheme } from '@emotion/react'
import HamburgerMenu from 'react-hamburger-menu'
import { Flex, Text } from 'theme-ui'
import { Logo } from './Menu/Logo/Logo'
import { MenuDesktop } from './Menu/MenuDesktop'
import { MenuMobilePanel } from './Menu/MenuMobile/MenuMobilePanel'
import { NotificationsDesktop } from './Menu/Notifications/NotificationsDesktop'
import { NotificationsIcon } from './Menu/Notifications/NotificationsIcon'
import { NotificationsMobile } from './Menu/Notifications/NotificationsMobile'
import { Profile } from './Menu/Profile/Profile'

export interface SiteHeaderProps {
  // TODO
  user: any
  menu: any
  notifications: any
}

export const SiteHeader = (props: SiteHeaderProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user, menu, notifications } = props
  const theme = useTheme() as any
  const isLoggedInUser = !!user
  const areThereNotifications = false

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
              onCLick={() => menu.toggleMobileNotifications()}
              isMobileMenuActive={menu.showMobileNotifications}
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
          <MenuDesktop pageList={[]} />
          {isLoggedInUser && (
            <>
              <NotificationsDesktop
                notifications={notifications}
                markAllRead={() =>
                  console.log(
                    `TODO: this.injected.userNotificationsStore.markAllNotificationsRead()`,
                  )
                }
                markAllNotified={() =>
                  console.log(
                    `TODO: this.injected.userNotificationsStore.markAllNotificationsNotified()`,
                  )
                }
              />
            </>
          )}
          <Profile isMobile={false} />
        </Flex>
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
              markAllRead={() =>
                console.log(
                  `this.injected.userNotificationsStore.markAllNotificationsRead()`,
                )
              }
              markAllNotified={() =>
                console.log(
                  `this.injected.userNotificationsStore.markAllNotificationsNotified()`,
                )
              }
            />
          </MobileMenuWrapper>
        </AnimationContainer>
      )}
    </>
  )
}

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
