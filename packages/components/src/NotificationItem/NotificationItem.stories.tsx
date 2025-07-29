import { faker } from '@faker-js/faker'

import { NotificationItem } from './NotificationItem'

import type { Meta, StoryFn } from '@storybook/react-vite'

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
    (Legacy)
    {faker.lorem.sentence()}
  </NotificationItem>
)

export const CommentDiscussion: StoryFn<typeof NotificationItem> = () => (
  <NotificationItem type="new_comment_discussion">
    {faker.lorem.sentence()}
  </NotificationItem>
)

export const CommentResearch: StoryFn<typeof NotificationItem> = () => (
  <NotificationItem type="new_comment_research">
    (Legacy)
    {faker.lorem.sentence()}
  </NotificationItem>
)

export const UsefulResearch: StoryFn<typeof NotificationItem> = () => (
  <NotificationItem type="research_useful">
    {faker.lorem.sentence()}
  </NotificationItem>
)
