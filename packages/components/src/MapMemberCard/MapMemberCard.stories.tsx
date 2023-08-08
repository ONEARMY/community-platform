import type { StoryFn, Meta } from '@storybook/react'
import { MapMemberCard } from './MapMemberCard'
import { faker } from '@faker-js/faker'

export default {
  title: 'Components/MapMemberCard',
  component: MapMemberCard,
} as Meta<typeof MapMemberCard>

export const Default: StoryFn<typeof MapMemberCard> = () => (
  <MapMemberCard
    imageUrl="https://placekitten.com/450/450"
    description={`${faker.lorem.sentence()}`}
    user={{
      username: faker.internet.userName(),
      isVerified: faker.datatype.boolean(),
      country: faker.address.countryCode('alpha-2'),
    }}
    heading={`${faker.lorem.word()}`}
    isEditable={false}
  />
)

export const LoadingState: StoryFn<typeof MapMemberCard> = () => (
  <MapMemberCard
    loading
    imageUrl="https://placekitten.com/450/450"
    description={`${faker.lorem.sentence()}`}
    user={{
      username: faker.internet.userName(),
      isVerified: faker.datatype.boolean(),
      country: faker.address.countryCode('alpha-2'),
    }}
    heading={`${faker.lorem.word()}`}
    isEditable={false}
  />
)
