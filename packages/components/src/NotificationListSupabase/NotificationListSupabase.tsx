import { Flex, Heading } from 'theme-ui'

import { NotificationListItemSupabase } from './NotificationListItemSupabase'

import type { Notification } from 'oa-shared'

export interface IProps {
  markRead: (id: number) => void
  modalDismiss: () => void
  notifications: Notification[]
}

export const NotificationListSupabase = (props: IProps) => {
  const { markRead, modalDismiss, notifications } = props

  return (
    <Flex
      data-cy="NotificationListSupabase"
      sx={{ flexDirection: 'column', gap: 2 }}
    >
      <Heading>Notifications</Heading>
      {notifications
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : 0))
        .map((notification, index) => {
          return (
            <NotificationListItemSupabase
              key={index}
              markRead={markRead}
              modalDismiss={modalDismiss}
              notification={notification}
            />
          )
        })}
    </Flex>
  )
}
