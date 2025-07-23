import { useContext, useEffect, useState } from 'react'
import { withTheme } from '@emotion/react'
import { observer } from 'mobx-react'
// eslint-disable-next-line import/no-unresolved
import { isModuleSupported, MODULE } from 'src/modules'
import Logo from 'src/pages/common/Header/Menu/Logo/Logo'
import MenuDesktop from 'src/pages/common/Header/Menu/MenuDesktop'
import Profile from 'src/pages/common/Header/Menu/Profile/Profile'
import { notificationSupabaseService } from 'src/services/notificationSupabaseService'
import { Flex } from 'theme-ui'

import { EnvironmentContext } from '../EnvironmentContext'
import { NotificationsContext } from '../NotificationsContext'
import { MenuMobile } from './Menu/MenuMobile'
import { MenusContext } from './MenusContext'
import { Notifications } from './Notifications'

import type { NotificationDisplay } from 'oa-shared'

const Header = observer(() => {
  const env = useContext(EnvironmentContext)

  const [notifications, setNotifications] = useState<
    NotificationDisplay[] | null
  >(null)
  const [isUpdatingNotifications, setIsUpdatingNotifications] =
    useState<boolean>(true)

  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false)
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)

  const updateNotifications = async () => {
    setIsUpdatingNotifications(true)
    const notifications = await notificationSupabaseService.getNotifications()
    setNotifications(notifications)
    setIsUpdatingNotifications(false)
  }

  useEffect(() => {
    updateNotifications()
  }, [])

  const onNavigationOpen = () => {
    setIsNotificationsOpen(false)
    setIsMenuOpen(true)
  }

  const onNotificationOpen = () => {
    setIsMenuOpen(false)
    setIsNotificationsOpen(true)
  }

  const closeAll = () => {
    setIsMenuOpen(false)
    setIsNotificationsOpen(false)
  }

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        isUpdatingNotifications,
        updateNotifications,
      }}
    >
      <MenusContext.Provider value={{ closeAll }}>
        <Logo />
        <Flex
          data-cy="header"
          sx={{
            backgroundColor: 'white',
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'flex-end',
            minHeight: 80,
            gap: 2,
            paddingX: [2, 4],
          }}
        >
          <MenuDesktop />
          <MenuMobile isOpen={isMenuOpen} onOpen={onNavigationOpen} />
          <Notifications
            isOpen={isNotificationsOpen}
            onOpen={onNotificationOpen}
          />

          {isModuleSupported(
            env?.VITE_SUPPORTED_MODULES || '',
            MODULE.USER,
          ) && <Profile />}
        </Flex>
      </MenusContext.Provider>
    </NotificationsContext.Provider>
  )
})

export default withTheme(Header)
