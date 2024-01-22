import { UserStatistics } from './UserStatistics'

import type { ComponentStory, Meta } from '@storybook/react'

export default {
  title: 'Components/UserStatistics',
  component: UserStatistics,
} as Meta<typeof UserStatistics>

const Template: ComponentStory<typeof UserStatistics> = (args) => (
  <UserStatistics {...args} />
)

export const Default = Template.bind({})
Default.args = {
  userName: 'Test User',
  country: 'Greenland',
  isVerified: true,
  isSupporter: true,
  howtoCount: 10,
  usefulCount: 20,
  researchCount: 2,
}
