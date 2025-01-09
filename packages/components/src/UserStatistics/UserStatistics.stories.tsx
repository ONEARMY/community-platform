import { UserStatistics } from './UserStatistics'

import type { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Layout/UserStatistics',
  component: UserStatistics,
} as Meta<typeof UserStatistics>

const Template: StoryFn<typeof UserStatistics> = (args) => (
  <UserStatistics {...args} />
)

export const Default = Template.bind({})
Default.args = {
  userName: 'Test User',
  country: 'Greenland',
  isVerified: true,
  isSupporter: true,
  libraryCount: 10,
  usefulCount: 20,
  researchCount: 2,
}
