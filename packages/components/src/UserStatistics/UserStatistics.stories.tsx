import { UserStatistics } from './UserStatistics'

import type { Meta, StoryFn } from '@storybook/react-vite'

export default {
  title: 'Layout/UserStatistics',
  component: UserStatistics,
} as Meta<typeof UserStatistics>

const Template: StoryFn<typeof UserStatistics> = (args) => (
  <UserStatistics {...args} />
)

export const Default = Template.bind({})
Default.args = {
  profile: {
    username: 'Test User',
    id: 1,
    isSupporter: true,
    isVerified: true,
    totalViews: 23,
  },
  pin: {
    country: 'Greenland',
  },
  libraryCount: 10,
  usefulCount: 20,
  researchCount: 2,
}
