import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { UserStatistics } from './UserStatistics'
import { faker } from '@faker-js/faker'

export default {
  title: 'Components/UserStatistics',
  component: UserStatistics,
} as ComponentMeta<typeof UserStatistics>

export const Default: ComponentStory<typeof UserStatistics> = () => (
  <UserStatistics
    userName={faker.internet.userName()}
    country={faker.address.country()}
    isVerified={true}
    isSupporter={true}
    howtoCount={faker.datatype.number()}
    eventCount={faker.datatype.number()}
  />
)
