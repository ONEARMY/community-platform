import { useState } from 'react'
import Foco from 'react-foco'
import { NotificationList } from 'oa-components'
import { Flex } from 'theme-ui'

import { NotificationsIcon } from './NotificationsIcon'

import type { UserNotificationItem } from 'oa-shared'

import '../Profile/profile.css'

export interface Props {
  notifications: UserNotificationItem[]
  markAllRead: () => void
  markAllNotified: () => void
}

export const NotificationsDesktop = (props: Props) => {
  const { notifications, markAllRead, markAllNotified } = props
  const [showMobileNotifications, setMobileNotificationVisibility] =
    useState(false)
  const areThereNotifications = Boolean(notifications.length)

  return (
    <Foco onClickOutside={() => setMobileNotificationVisibility(false)}>
      <div data-cy="notifications-desktop" className="util__fade-in">
        <NotificationsIcon
          onCLick={() =>
            setMobileNotificationVisibility(!showMobileNotifications)
          }
          isMobileMenuActive={false}
          areThereNotifications={areThereNotifications}
        />
        {showMobileNotifications && (
          <Flex>
            <div data-cy="notifications-modal-desktop">
              <NotificationList
                notifications={notifications}
                markAllNotified={markAllNotified}
                markAllRead={() => markAllRead && markAllRead()}
                sx={{
                  width: '250px',
                  position: 'absolute',
                  right: '10px',
                  top: '60px',
                }}
              />
            </div>
          </Flex>
        )}
      </div>
    </Foco>
  )
}
