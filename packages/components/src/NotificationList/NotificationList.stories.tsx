import { faker } from '@faker-js/faker'

import { InternalLink } from '../InternalLink/InternalLink'
import { NotificationList } from './NotificationList'

import type { Meta, StoryFn } from '@storybook/react'
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
        (Legacy) {faker.lorem.words(4)}{' '}
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
    type: 'new_comment_discussion',
    children: (
      <>
        (Legacy) {faker.lorem.words(4)}{' '}
        <InternalLink to="/">{faker.lorem.words(2)}</InternalLink>
      </>
    ),
  },
  {
    type: 'new_comment_research',
    children: (
      <>
        (Legacy) {faker.lorem.words(4)}{' '}
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
