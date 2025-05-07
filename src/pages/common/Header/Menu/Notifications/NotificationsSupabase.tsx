import { useContext, useState } from 'react'
import { Icon, Modal, NotificationListSupabase } from 'oa-components'
import { NotificationsContext } from 'src/pages/common/NotificationsContext'
import { Box } from 'theme-ui'

interface IProps {
  device: 'desktop' | 'mobile'
}

export const NotificationsSupabase = ({ device }: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { notifications, isUpdatingNotifications, updateNotifications } =
    useContext(NotificationsContext)

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

  const onClick = () => setIsOpen(!isOpen)

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
    <Box data-cy={`NotificationsSupabase-${device}`}>
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
      <Modal isOpen={isOpen} onDidDismiss={onClick} width={800}>
        <NotificationListSupabase
          isUpdatingNotifications={isUpdatingNotifications}
          markAllRead={markAllRead}
          markRead={markRead}
          modalDismiss={onClick}
          notifications={notifications}
        />
      </Modal>
    </Box>
  )
}
