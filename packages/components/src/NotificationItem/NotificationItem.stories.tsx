import { faker } from '@faker-js/faker'
import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { NotificationItem } from './NotificationItem'

export default {
  title: 'Components/NotificationItem',
  component: NotificationItem,
} as ComponentMeta<typeof NotificationItem>

export const Default: ComponentStory<typeof NotificationItem> = () => (
  <NotificationItem type="howto_useful">
    {faker.lorem.sentence()}
  </NotificationItem>
)

export const Comment: ComponentStory<typeof NotificationItem> = () => (
  <NotificationItem type="new_comment">
    {faker.lorem.sentence()}
  </NotificationItem>
)

export const CommentResearch: ComponentStory<typeof NotificationItem> = () => (
  <NotificationItem type="new_comment_research">
    {faker.lorem.sentence()}
  </NotificationItem>
)

export const UsefulResearch: ComponentStory<typeof NotificationItem> = () => (
  <NotificationItem type="research_useful">
    {faker.lorem.sentence()}
  </NotificationItem>
)
