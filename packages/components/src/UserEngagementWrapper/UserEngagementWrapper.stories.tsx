import type { StoryFn, Meta } from '@storybook/react'
import { UserEngagementWrapper } from './UserEngagementWrapper'

export default {
  title: 'Components/UserEngagementWrapper',
} as Meta

export const Basic: StoryFn<typeof UserEngagementWrapper> = () => (
  <UserEngagementWrapper>
    <p>A little wrapper using the bubble background.</p>
  </UserEngagementWrapper>
)
