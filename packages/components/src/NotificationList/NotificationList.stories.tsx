import { faker } from '@faker-js/faker'
import type { StoryFn, Meta } from '@storybook/react'
import { InternalLink } from '../InternalLink/InternalLink'
import { NotificationList } from './NotificationList'
import type { UserNotificationList } from './NotificationList'

export default {
  title: 'Components/NotificationList',
  component: NotificationList,
} as Meta<typeof NotificationList>

const notifications = [
  {
    type: 'howto_mention',
    children: (
      <>
        {faker.lorem.words(4)} <InternalLink to="#">Example Link</InternalLink>
      </>
    ),
  },
  {
    type: 'new_comment',
    children: (
      <>
        {faker.lorem.words(4)}{' '}
        <InternalLink to="/">{faker.lorem.words(2)}</InternalLink>
      </>
    ),
  },
  {
    type: 'howto_useful',
    children: (
      <>
        {faker.lorem.words(4)}{' '}
        <InternalLink to="/">{faker.lorem.words(2)}</InternalLink>
      </>
    ),
  },
  {
    type: 'new_comment_research',
    children: (
      <>
        {faker.lorem.words(4)}{' '}
        <InternalLink to="/">{faker.lorem.words(2)}</InternalLink>
      </>
    ),
  },
  {
    type: 'research_useful',
    children: (
      <>
        {faker.lorem.words(4)}{' '}
        <InternalLink to="/">{faker.lorem.words(2)}</InternalLink>
      </>
    ),
  },
  {
    type: 'research_update',
    children: (
      <>
        {faker.lorem.words(4)}{' '}
        <InternalLink to="#">Research Article link</InternalLink>
      </>
    ),
  },
] as UserNotificationList

export const Default: StoryFn<typeof NotificationList> = () => (
  <NotificationList notifications={notifications} />
)

export const LongList: StoryFn<typeof NotificationList> = () => (
  <NotificationList
    notifications={[
      ...notifications,
      ...notifications,
      ...notifications,
      ...notifications,
    ]}
  />
)

export const Empty: StoryFn<typeof NotificationList> = () => (
  <NotificationList notifications={[]} />
)
