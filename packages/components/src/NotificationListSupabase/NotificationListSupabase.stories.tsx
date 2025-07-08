import { fakeDisplayNotification } from '../utils'
import { NotificationListSupabase } from './NotificationListSupabase'

import type { Meta, StoryFn } from '@storybook/react-vite'

export default {
  title: 'Components/NotificationListSupabase',
  component: NotificationListSupabase,
} as Meta<typeof NotificationListSupabase>

const newsReplyNotification = fakeDisplayNotification({ isRead: false })

const questionCommentNotification = fakeDisplayNotification({ isRead: true })

export const Default: StoryFn<typeof NotificationListSupabase> = () => (
  <NotificationListSupabase
    isUpdatingNotifications={false}
    markAllRead={() => console.log('markAllRead')}
    markRead={() => console.log('markRead')}
    modalDismiss={() => console.log('modalDismiss')}
    notifications={[newsReplyNotification, questionCommentNotification]}
  />
)

export const NoNewNotifications: StoryFn<
  typeof NotificationListSupabase
> = () => (
  <NotificationListSupabase
    isUpdatingNotifications={false}
    markAllRead={() => console.log('markAllRead')}
    markRead={() => console.log('markRead')}
    modalDismiss={() => console.log('modalDismiss')}
    notifications={[questionCommentNotification]}
  />
)
