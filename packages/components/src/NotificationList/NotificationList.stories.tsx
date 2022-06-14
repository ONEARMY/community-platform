import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { NotificationList } from './NotificationList'

export default {
  title: 'Notifications/NotificationList',
  component: NotificationList,
} as ComponentMeta<typeof NotificationList>

export const Default: ComponentStory<typeof NotificationList> = () => (
  <NotificationList
    notifications={
      [
        {
          triggeredBy: {
            displayName: 'Example User',
            userId: 'abc',
          },
          type: 'new_comment',
          relevantUrl: 'https://example.com',
        },
        {
          triggeredBy: {
            displayName: 'Example User',
            userId: 'abc',
          },
          type: 'howto_useful',
          relevantUrl: 'https://example.com',
        },
        {
          triggeredBy: {
            displayName: 'Example User',
            userId: 'abc',
          },
          type: 'new_comment_research',
          relevantUrl: 'https://example.com',
        },
        {
          triggeredBy: {
            displayName: 'Example User',
            userId: 'abc',
          },
          type: 'research_useful',
          relevantUrl: 'https://example.com',
        },
      ] as any
    }
  />
)

export const Empty: ComponentStory<typeof NotificationList> = () => (
  <NotificationList notifications={[] as any} />
)
