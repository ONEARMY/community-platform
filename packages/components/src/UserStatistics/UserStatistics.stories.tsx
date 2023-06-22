import type { ComponentStory, Meta } from '@storybook/react'
import { UserStatistics } from './UserStatistics'

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
  eventCount: 4,
  usefulCount: 20,
  researchCount: 2,
}
