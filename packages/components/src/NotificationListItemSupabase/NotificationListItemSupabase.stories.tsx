import { Flex, Heading } from 'theme-ui'

import {
  fakeCommentSB,
  fakeNewsSB,
  fakeNotification,
  fakeQuestionSB,
  fakeResearchItem,
  fakeResearchUpdate,
} from '../utils'
import { NotificationListItemSupabase } from './NotificationListItemSupabase'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Components/NotificationListItemSupabase',
  component: NotificationListItemSupabase,
} as Meta<typeof NotificationListItemSupabase>

const comment = fakeCommentSB()
const reply = fakeCommentSB()
const news = fakeNewsSB()
const question = fakeQuestionSB()
const researchItem = fakeResearchItem()
const researchUpdate = fakeResearchUpdate()

const newsCommentNotification = fakeNotification({
  sourceContent: news,
  content: comment,
})

const newsReplyNotification = fakeNotification({
  contentType: 'reply',
  parentCommentId: comment.id,
  parentComment: comment,
  sourceContent: news,
  content: reply,
})

const questionCommentNotification = fakeNotification({
  sourceContentType: 'questions',
  sourceContent: question,
  content: comment,
})

const questionReplyNotification = fakeNotification({
  contentType: 'reply',
  parentCommentId: comment.id,
  parentComment: comment,
  sourceContentType: 'questions',
  sourceContent: question,
  content: reply,
})

const researchCommentNotification = fakeNotification({
  sourceContentType: 'research_update',
  sourceContent: researchItem,
  content: comment,
  parentContentId: researchUpdate.id,
  parentContent: researchUpdate,
})

const researchReplyNotification = fakeNotification({
  contentType: 'reply',
  parentCommentId: comment.id,
  parentComment: comment,
  sourceContentType: 'research_update',
  sourceContent: researchItem,
  content: reply,
})

const markRead = () => console.log('markRead')
const modalDismiss = () => console.log('modalDismiss')

export const Default: StoryFn<typeof NotificationListItemSupabase> = () => (
  <Flex sx={{ gap: 2, maxWidth: '700px', flexDirection: 'column' }}>
    <Heading>News</Heading>
    <NotificationListItemSupabase
      markRead={markRead}
      modalDismiss={modalDismiss}
      notification={newsCommentNotification}
    />
    <NotificationListItemSupabase
      markRead={markRead}
      modalDismiss={modalDismiss}
      notification={newsReplyNotification}
    />
    <Heading>Questions</Heading>
    <NotificationListItemSupabase
      markRead={markRead}
      modalDismiss={modalDismiss}
      notification={questionCommentNotification}
    />
    <NotificationListItemSupabase
      markRead={markRead}
      modalDismiss={modalDismiss}
      notification={questionReplyNotification}
    />
    <Heading>Research</Heading>
    <NotificationListItemSupabase
      markRead={markRead}
      modalDismiss={modalDismiss}
      notification={researchCommentNotification}
    />
    <NotificationListItemSupabase
      markRead={markRead}
      modalDismiss={modalDismiss}
      notification={researchReplyNotification}
    />
  </Flex>
)

// export const NoNewNotifications: StoryFn<
//   typeof NotificationListItemSupabase
// > = () => <NotificationListItemSupabase markRead={} modalDismiss notification />
