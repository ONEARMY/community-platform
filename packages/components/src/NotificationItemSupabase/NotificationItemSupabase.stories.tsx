import { NotificationDisplay } from 'oa-shared'
import { Flex, Heading } from 'theme-ui'

import {
  fakeCommentSB,
  fakeNewsSB,
  fakeNotification,
  fakeQuestionSB,
  fakeResearchItem,
  fakeResearchUpdate,
} from '../utils'
import { NotificationItemSupabase } from './NotificationItemSupabase'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Components/NotificationItemSupabase',
  component: NotificationItemSupabase,
} as Meta<typeof NotificationItemSupabase>

const comment = fakeCommentSB()
const reply = fakeCommentSB()
const news = fakeNewsSB()
const question = fakeQuestionSB()
const researchItem = fakeResearchItem()
const researchUpdate = fakeResearchUpdate()

const newsCommentNotification = NotificationDisplay.fromNotification(
  fakeNotification({
    sourceContent: news,
    content: comment,
  }),
)

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
  }),
)

const questionReplyNotification = NotificationDisplay.fromNotification(
  fakeNotification({
    contentType: 'reply',
    parentCommentId: comment.id,
    parentComment: comment,
    sourceContentType: 'questions',
    sourceContent: question,
    content: reply,
  }),
)

const researchCommentNotification = NotificationDisplay.fromNotification(
  fakeNotification({
    sourceContentType: 'research_update',
    sourceContent: researchItem,
    content: comment,
    parentContentId: researchUpdate.id,
    parentContent: researchUpdate,
  }),
)

const researchReplyNotification = NotificationDisplay.fromNotification(
  fakeNotification({
    contentType: 'reply',
    parentCommentId: comment.id,
    parentComment: comment,
    sourceContentType: 'research_update',
    sourceContent: researchItem,
    content: reply,
  }),
)

const markRead = () => console.log('markRead')
const modalDismiss = () => console.log('modalDismiss')

export const Default: StoryFn<typeof NotificationItemSupabase> = () => (
  <Flex sx={{ gap: 2, maxWidth: '700px', flexDirection: 'column' }}>
    <Heading>News</Heading>
    <NotificationItemSupabase
      markRead={markRead}
      modalDismiss={modalDismiss}
      notification={newsCommentNotification}
    />
    <NotificationItemSupabase
      markRead={markRead}
      modalDismiss={modalDismiss}
      notification={newsReplyNotification}
    />
    <Heading>Questions</Heading>
    <NotificationItemSupabase
      markRead={markRead}
      modalDismiss={modalDismiss}
      notification={questionCommentNotification}
    />
    <NotificationItemSupabase
      markRead={markRead}
      modalDismiss={modalDismiss}
      notification={questionReplyNotification}
    />
    <Heading>Research</Heading>
    <NotificationItemSupabase
      markRead={markRead}
      modalDismiss={modalDismiss}
      notification={researchCommentNotification}
    />
    <NotificationItemSupabase
      markRead={markRead}
      modalDismiss={modalDismiss}
      notification={researchReplyNotification}
    />
  </Flex>
)
