import { NotificationDisplay } from 'oa-shared'

import {
  fakeCommentSB,
  fakeNewsSB,
  fakeNotification,
  fakeQuestionSB,
} from '../utils'
import { NotificationListSupabase } from './NotificationListSupabase'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Components/NotificationListSupabase',
  component: NotificationListSupabase,
} as Meta<typeof NotificationListSupabase>

const comment = fakeCommentSB()
const reply = fakeCommentSB()
const news = fakeNewsSB()
const question = fakeQuestionSB()

const newsReplyNotification = NotificationDisplay.fromNotification(
  fakeNotification({
    contentType: 'reply',
    parentCommentId: comment.id,
    parentComment: comment,
    sourceContent: news,
    content: reply,
  }),
)

const questionCommentNotification = NotificationDisplay.fromNotification(
  fakeNotification({
    sourceContentType: 'questions',
    sourceContent: question,
    content: comment,
    isRead: true,
  }),
)

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
