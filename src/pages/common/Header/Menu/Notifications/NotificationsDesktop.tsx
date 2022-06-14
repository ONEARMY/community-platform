import { useState } from 'react'
import { Flex } from 'theme-ui'
import { NotificationsIcon } from './NotificationsIcon'
import Foco from 'react-foco'
import { NotificationList } from 'oa-components'

export interface Props {
  notifications: any[]
  handleOnClick: () => void
}

export const NotificationsDesktop = (props: Props) => {
  const { notifications, handleOnClick } = props
  const [showMobileNotifications, setMobileNotificationVisibility] =
    useState(false)
  const areThereNotifications = Boolean(notifications.length)

  return (
    <Foco onClickOutside={() => setMobileNotificationVisibility(false)}>
      <div data-cy="notifications-desktop">
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
                handleOnClick={() => handleOnClick && handleOnClick()}
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
