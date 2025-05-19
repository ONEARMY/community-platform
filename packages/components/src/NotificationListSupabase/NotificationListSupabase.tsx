import { useState } from 'react'
import { Box, Flex, Heading } from 'theme-ui'

import { Button } from '../Button/Button'
import { InternalLink } from '../InternalLink/InternalLink'
import { Loader } from '../Loader/Loader'
import { NotificationListItemSupabase } from './NotificationListItemSupabase'

import type { Notification } from 'oa-shared'

export interface IProps {
  isUpdatingNotifications: boolean
  markAllRead: () => void
  markRead: (id: number) => void
  modalDismiss: () => void
  notifications: Notification[]
}

export const NotificationListSupabase = (props: IProps) => {
  const [isUnreadOnly, setIsUnreadOnly] = useState<boolean>(true)
  const {
    isUpdatingNotifications,
    markAllRead,
    markRead,
    modalDismiss,
    notifications,
  } = props

  const anyUnread = notifications.filter(({ isRead }) => !isRead).length > 0
  const notificationList = notifications
    .filter(({ isRead }) => (isUnreadOnly ? !isRead : !isRead || isRead))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : 0))

  return (
    <Flex
      data-cy="NotificationListSupabase"
      sx={{ flexDirection: 'column', gap: 2 }}
    >
      <Heading>Notifications</Heading>
      <Flex
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
          gap: 2,
        }}
      >
        <Flex sx={{ alignItems: 'center', gap: 2 }}>
          <Flex
            sx={{
              border: '2px solid',
              borderRadius: 2,
              overflow: 'hidden',
              backgroundColor: 'black',
              gap: '2px',
            }}
          >
            <Button
              onClick={() => setIsUnreadOnly(true)}
              variant="subtle"
              sx={{
                backgroundColor: isUnreadOnly ? 'activeYellow' : 'white',
                borderRadius: 0,
                ':hover': {
                  backgroundColor: isUnreadOnly ? 'activeYellow' : 'white',
                  textDecoration: isUnreadOnly ? 'none' : 'underline',
                },
              }}
            >
              Unread
            </Button>
            <Button
              data-testid="NotificationListSupabase-ShowAll"
              onClick={() => setIsUnreadOnly(false)}
              variant="subtle"
              sx={{
                backgroundColor: !isUnreadOnly ? 'activeYellow' : 'white',
                borderRadius: 0,
                ':hover': {
                  backgroundColor: !isUnreadOnly ? 'activeYellow' : 'white',
                  textDecoration: !isUnreadOnly ? 'none' : 'underline',
                },
              }}
            >
              All
            </Button>
          </Flex>
          {anyUnread && (
            <Button
              data-testid="NotificationListSupabase-MarkAllRead"
              onClick={markAllRead}
              disabled={isUpdatingNotifications}
              icon="add"
              variant="outline"
            >
              Mark all read
            </Button>
          )}
        </Flex>
        <InternalLink to="/settings/notifications">
          <Button
            icon="account"
            variant="outline"
            sx={{ alignSelf: 'flex-end' }}
            onClick={modalDismiss}
            showIconOnly
          >
            Update preferences
          </Button>
        </InternalLink>
      </Flex>
      {isUpdatingNotifications && <Loader />}
      {!isUpdatingNotifications &&
        notificationList.map((notification, index) => {
          return (
            <NotificationListItemSupabase
              key={index}
              markRead={markRead}
              modalDismiss={modalDismiss}
              notification={notification}
            />
          )
        })}
      {notificationList.length === 0 && !isUpdatingNotifications && (
        <Box
          sx={{
            backgroundColor: 'background',
            borderRadius: 2,
            padding: 4,
            textAlign: 'center',
          }}
        >
          Wow... No unread notifications!
        </Box>
      )}
    </Flex>
  )
}
