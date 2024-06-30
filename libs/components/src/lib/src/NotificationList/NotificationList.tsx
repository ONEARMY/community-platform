import { useEffect } from 'react'
import styled from '@emotion/styled'
import { Box, Card, Text } from 'theme-ui'

import { Button } from '../Button/Button'
import { NotificationItem } from '../NotificationItem/NotificationItem'

import type { UserNotificationItem } from '@onearmy.apps/shared'
import type { ThemeUIStyleObject } from 'theme-ui'

export interface Props {
  notifications: UserNotificationItem[]
  markAllRead: () => void
  markAllNotified: () => void
  sx?: ThemeUIStyleObject
}

const ModalItem = styled(Box)`
  display: flex;
  flex-direction: column;
  color: #000;
  padding: 10px 30px 10px 30px;
  text-align: center;
  width: 100%;
  }
`

export const NotificationList = (props: Props) => {
  const { notifications, markAllRead, markAllNotified } = props
  const sx = props.sx || {}
  useEffect(() => {
    if (notifications.length) {
      markAllNotified()
    }
  }, [])

  return (
    <Card sx={{ padding: 2, maxHeight: 310, overflowY: 'auto', ...sx }}>
      {notifications.length ? (
        <>
          <ModalItem style={{ textAlign: 'center' }}>Notifications</ModalItem>
          {notifications.map((notification, idx) => (
            <NotificationItem key={idx} {...(notification as any)} />
          ))}
          <Button
            style={{
              width: '100%',
              textAlign: 'center',
              display: 'flex',
              justifyContent: 'center',
            }}
            variant={'secondary'}
            data-cy="clear-notifications"
            onClick={() => markAllRead && markAllRead()}
          >
            Clear notifications
          </Button>
        </>
      ) : (
        <Text
          sx={{ display: 'block', textAlign: 'center' }}
          data-cy="NotificationList: empty state"
        >
          Nada, no new notifications
        </Text>
      )}
    </Card>
  )
}
