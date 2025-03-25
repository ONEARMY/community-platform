import { fakeCommentSB, fakeNewsSB, fakeQuestionSB } from '../utils'
import { NotificationListSupabase } from './NotificationListSupabase'

import type { Meta, StoryFn } from '@storybook/react'
import type { Notification } from 'oa-shared'

export default {
  title: 'Components/NotificationListSupabase',
  component: NotificationListSupabase,
} as Meta<typeof NotificationListSupabase>

const comment = fakeCommentSB()
const reply = fakeCommentSB()
const news = fakeNewsSB()
const question = fakeQuestionSB()

const notifications: Notification[] = [
  {
    id: 1,
    actionType: 'newComment',
    contentType: 'comment',
    contentId: comment.id,
    content: comment,
    createdAt: new Date(),
    modifiedAt: null,
    ownedById: 3,
    isRead: false,
    sourceContentType: 'news',
    sourceContentId: 4,
    sourceContent: news,
    triggeredBy: {
      id: 5,
      username: 'anna123',
      photoUrl: null,
    },
  },
  {
    id: 2,
    actionType: 'newComment',
    contentType: 'reply',
    contentId: reply.id,
    content: reply,
    createdAt: new Date(),
    modifiedAt: null,
    ownedById: 3,
    isRead: true,
    sourceContentType: 'questions',
    sourceContentId: 4,
    sourceContent: question,
    triggeredBy: {
      id: 6,
      username: 'tommo',
      photoUrl: null,
    },
  },
]

export const Default: StoryFn<typeof NotificationListSupabase> = () => (
  <NotificationListSupabase
    markRead={() => console.log('hi')}
    modalDismiss={() => console.log('hi')}
    notifications={notifications}
  />
)
