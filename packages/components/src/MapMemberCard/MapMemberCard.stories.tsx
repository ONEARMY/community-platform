import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { MapMemberCard } from './MapMemberCard'
import { faker } from '@faker-js/faker'

export default {
  title: 'Components/MapMemberCard',
  component: MapMemberCard,
} as ComponentMeta<typeof MapMemberCard>

export const Default: ComponentStory<typeof MapMemberCard> = () => (
  <MapMemberCard
    imageUrl="https://placekitten.com/450/450"
    description={`${faker.lorem.sentence()}`}
    lastActive={`${faker.date.past().toString()}`}
    user={{
      username: faker.internet.userName(),
      isVerified: faker.datatype.boolean(),
    }}
    heading={`${faker.lorem.word()}`}
  />
)

export const LoadingState: ComponentStory<typeof MapMemberCard> = () => (
  <MapMemberCard
    loading
    imageUrl="https://placekitten.com/450/450"
    description={`${faker.lorem.sentence()}`}
    lastActive={`${faker.date.past()}`}
    user={{
      username: faker.internet.userName(),
      isVerified: faker.datatype.boolean(),
    }}
    heading={`${faker.lorem.word()}`}
  />
)
