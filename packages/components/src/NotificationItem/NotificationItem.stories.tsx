import { faker } from '@faker-js/faker'
import type { StoryFn, Meta } from '@storybook/react'
import { NotificationItem } from './NotificationItem'

export default {
  title: 'Components/NotificationItem',
  component: NotificationItem,
} as Meta<typeof NotificationItem>

export const Default: StoryFn<typeof NotificationItem> = () => (
  <NotificationItem type="howto_useful">
    {faker.lorem.sentence()}
  </NotificationItem>
)

export const Comment: StoryFn<typeof NotificationItem> = () => (
  <NotificationItem type="new_comment">
    {faker.lorem.sentence()}
  </NotificationItem>
)

export const CommentResearch: StoryFn<typeof NotificationItem> = () => (
  <NotificationItem type="new_comment_research">
    {faker.lorem.sentence()}
  </NotificationItem>
)

export const UsefulResearch: StoryFn<typeof NotificationItem> = () => (
  <NotificationItem type="research_useful">
    {faker.lorem.sentence()}
  </NotificationItem>
)
