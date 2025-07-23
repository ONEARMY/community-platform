import { useContext } from 'react'
import {
  Icon,
  NotificationListSupabase,
  NotificationsModal,
} from 'oa-components'
import { NotificationsContext } from 'src/pages/common/NotificationsContext'
import { Box } from 'theme-ui'

import { MenusContext } from './MenusContext'

interface IProps {
  isOpen: boolean
  onOpen: () => void
}

export const Notifications = (props: IProps) => {
  const { notifications, isUpdatingNotifications, updateNotifications } =
    useContext(NotificationsContext)
  const menusContext = useContext(MenusContext)

  const { isOpen, onOpen } = props

  if (!notifications?.length) {
    return <></>
  }

  const markAllRead = async () => {
    await fetch(`/api/notifications/all/read`, { method: 'POST' })
    updateNotifications && (await updateNotifications())
  }

  const markRead = async (id: number) => {
    await fetch(`/api/notifications/${id}/read`, { method: 'POST' })
    updateNotifications && (await updateNotifications())
  }

  const isNoNewNotifications =
    notifications.length === 0 ||
    notifications?.filter(({ isRead }) => isRead === false).length === 0

  const onClick = () => (isOpen ? menusContext.closeAll() : onOpen())

  const iconProps = {
    onClick,
    size: 40,
    sx: {
      ':hover': {
        background: 'background',
        borderRadius: 99,
      },
    },
  }

  return (
    <Box data-cy="NotificationsSupabase">
      {isNoNewNotifications && (
        <Icon
          data-cy="notifications-no-new-messages"
          glyph="megaphone-inactive"
          {...iconProps}
        />
      )}
      {!isNoNewNotifications && (
        <Icon
          data-cy="notifications-new-messages"
          glyph="megaphone-active"
          {...iconProps}
        />
      )}
      <NotificationsModal isOpen={isOpen}>
        <NotificationListSupabase
          isUpdatingNotifications={isUpdatingNotifications}
          markAllRead={markAllRead}
          markRead={markRead}
          modalDismiss={menusContext.closeAll}
          notifications={notifications}
        />
      </NotificationsModal>
    </Box>
  )
}
