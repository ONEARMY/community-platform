import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { NotificationItem } from './NotificationItem'

export default {
  title: 'Components/NotificationItem',
  component: NotificationItem,
} as ComponentMeta<typeof NotificationItem>

export const Default: ComponentStory<typeof NotificationItem> = () => (
  <NotificationItem
    triggeredBy={{
      displayName: 'Example User',
      userId: 'abc',
    }}
    type="howto_useful"
    relevantUrl="http://example.com"
  />
)

export const Comment: ComponentStory<typeof NotificationItem> = () => (
  <NotificationItem
    triggeredBy={{
      displayName: 'Example User',
      userId: 'abc',
    }}
    type="new_comment"
    relevantUrl="http://example.com"
  />
)

export const CommentResearch: ComponentStory<typeof NotificationItem> = () => (
  <NotificationItem
    triggeredBy={{
      displayName: 'Example User',
      userId: 'abc',
    }}
    type="new_comment_research"
    relevantUrl="http://example.com"
  />
)

export const UsefulResearch: ComponentStory<typeof NotificationItem> = () => (
  <NotificationItem
    triggeredBy={{
      displayName: 'Example User',
      userId: 'abc',
    }}
    type="research_useful"
    relevantUrl="http://example.com"
  />
)
