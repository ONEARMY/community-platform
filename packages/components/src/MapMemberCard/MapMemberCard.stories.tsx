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
    moderationStatus="accepted"
    description={`${faker.lorem.sentence()}`}
    lastActive={`${faker.date.past().toString()}`}
    user={{
      username: faker.internet.userName(),
      isVerified: faker.datatype.boolean(),
      country: faker.address.countryCode('alpha-2'),
    }}
    heading={`${faker.lorem.word()}`}
    isEditable={false}
  />
)

export const LoadingState: ComponentStory<typeof MapMemberCard> = () => (
  <MapMemberCard
    loading
    imageUrl="https://placekitten.com/450/450"
    description={`${faker.lorem.sentence()}`}
    lastActive={`${faker.date.past()}`}
    moderationStatus="accepted"
    user={{
      username: faker.internet.userName(),
      isVerified: faker.datatype.boolean(),
      country: faker.address.countryCode('alpha-2'),
    }}
    heading={`${faker.lorem.word()}`}
    isEditable={false}
  />
)

export const AwaitingModeration: ComponentStory<typeof MapMemberCard> = () => (
  <MapMemberCard
    imageUrl="https://placekitten.com/450/450"
    description={`${faker.lorem.sentence()}`}
    lastActive={`${faker.date.past()}`}
    user={{
      username: faker.internet.userName(),
      isVerified: faker.datatype.boolean(),
      country: faker.address.countryCode('alpha-2'),
    }}
    heading={`${faker.lorem.word()}`}
    moderationStatus="awaiting-moderation"
    onPinModerated={(isPinApproved) => {
      alert('Approved? ' + JSON.stringify(isPinApproved))
    }}
    isEditable={true}
  />
)

export const Draft: ComponentStory<typeof MapMemberCard> = () => (
  <MapMemberCard
    imageUrl="https://placekitten.com/450/450"
    description={`${faker.lorem.sentence()}`}
    lastActive={`${faker.date.past()}`}
    user={{
      username: faker.internet.userName(),
      isVerified: faker.datatype.boolean(),
      country: faker.address.countryCode('alpha-2'),
    }}
    heading={`${faker.lorem.word()}`}
    moderationStatus="draft"
    onPinModerated={(isPinApproved) => {
      alert('Approved? ' + JSON.stringify(isPinApproved))
    }}
    isEditable={true}
  />
)

export const Rejected: ComponentStory<typeof MapMemberCard> = () => (
  <MapMemberCard
    imageUrl="https://placekitten.com/450/450"
    description={`${faker.lorem.sentence()}`}
    lastActive={`${faker.date.past()}`}
    user={{
      username: faker.internet.userName(),
      isVerified: faker.datatype.boolean(),
      country: faker.address.countryCode('alpha-2'),
    }}
    heading={`${faker.lorem.word()}`}
    moderationStatus="rejected"
    onPinModerated={(isPinApproved) => {
      alert('Approved? ' + JSON.stringify(isPinApproved))
    }}
    isEditable={false}
  />
)
