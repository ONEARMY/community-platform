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
    badges: [
      {
        id: 1,
        displayName: 'PRO',
        name: 'pro',
        imageUrl: '',
      },
      {
        id: 2,
        displayName: 'Supporter',
        name: 'supporter',
        actionUrl: 'https://www.patreon.com/one_army',
        imageUrl: '',
      },
    ],
    totalViews: 23,
  },
  pin: {
    country: 'Greenland',
  },
  libraryCount: 10,
  usefulCount: 20,
  researchCount: 2,
}
