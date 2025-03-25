import { useContext, useState } from 'react'
import { Icon, Modal, NotificationListSupabase } from 'oa-components'
import { NotificationsContext } from 'src/pages/common/NotificationsContext'

export const NotificationsSupabase = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const notifications = useContext(NotificationsContext)

  if (notifications === null) {
    return <></>
  }

  const isNoNewNotifications = notifications.length === 0
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
    <>
      {isNoNewNotifications && (
        <Icon glyph="megaphone-inactive" {...iconProps} />
      )}
      {!isNoNewNotifications && (
        <Icon glyph="megaphone-active" {...iconProps} />
      )}
      <Modal isOpen={isOpen} onDidDismiss={onClick}>
        <NotificationListSupabase notifications={notifications} />
      </Modal>
    </>
  )
}
