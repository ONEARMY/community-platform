import { useState } from 'react'
import { Box, Flex, Heading } from 'theme-ui'

import { Button } from '../Button/Button'
import { ButtonIcon } from '../ButtonIcon/ButtonIcon'
import { InternalLink } from '../InternalLink/InternalLink'
import { Loader } from '../Loader/Loader'
import { NotificationItemSupabase } from '../NotificationItemSupabase/NotificationItemSupabase'

import type { NotificationDisplay } from 'oa-shared'

export interface IProps {
  isUpdatingNotifications: boolean
  markAllRead: () => void
  markRead: (id: number) => void
  modalDismiss: () => void
  notifications: NotificationDisplay[]
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
    .sort((a, b) => (a.date < b.date ? 1 : -1))

  return (
    <Flex
      data-cy="NotificationListSupabase"
      sx={{ flexDirection: 'column', gap: 4 }}
    >
      <Flex sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Heading sx={{ fontSize: 6 }}>Notifications</Heading>
        <ButtonIcon
          data-cy="MapFilterList-CloseButton"
          icon="close"
          onClick={modalDismiss}
          sx={{ border: 'none', paddingLeft: 2, paddingRight: 3 }}
        />
      </Flex>
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
            <NotificationItemSupabase
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
