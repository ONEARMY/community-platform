import { faker } from '@faker-js/faker'
import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { InternalLink } from '../InternalLink/InternalLink'
import { NotificationList } from './NotificationList'
import type { UserNotificationList } from './NotificationList'

export default {
  title: 'Components/NotificationList',
  component: NotificationList,
} as ComponentMeta<typeof NotificationList>

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

export const Default: ComponentStory<typeof NotificationList> = () => (
  <NotificationList notifications={notifications} />
)

export const LongList: ComponentStory<typeof NotificationList> = () => (
  <NotificationList
    notifications={[
      ...notifications,
      ...notifications,
      ...notifications,
      ...notifications,
    ]}
  />
)

export const Empty: ComponentStory<typeof NotificationList> = () => (
  <NotificationList notifications={[]} />
)
