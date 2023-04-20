import type { StoryFn, Meta } from '@storybook/react'
import { UserStatistics } from './UserStatistics'
import { faker } from '@faker-js/faker'

export default {
  title: 'Components/UserStatistics',
  component: UserStatistics,
} as Meta<typeof UserStatistics>

export const Default: StoryFn<typeof UserStatistics> = () => (
  <UserStatistics
    userName={faker.internet.userName()}
    country={faker.address.country()}
    isVerified={true}
    isSupporter={true}
    howtoCount={faker.datatype.number()}
    eventCount={faker.datatype.number()}
  />
)
