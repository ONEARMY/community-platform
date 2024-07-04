import { faker } from '@faker-js/faker'

import { MapMemberCard } from './MapMemberCard'

import type { Meta } from '@storybook/react'

export default {
  title: 'Components/MapMemberCard',
  component: MapMemberCard,
} as Meta<typeof MapMemberCard>

export const Default = {
  args: {
    imageUrl: 'https://placekitten.com/450/450',
    description: `${faker.lorem.sentence()}`,
    user: {
      countryCode: faker.location.countryCode('alpha-2'),
      userName: faker.internet.userName(),
      isSupporter: faker.datatype.boolean(),
      isVerified: faker.datatype.boolean(),
    },
    heading: `${faker.lorem.word()}`,
    isEditable: false,
    comments: null,
  },
}

export const LoadingState = {
  args: {
    loading: true,
    imageUrl: 'https://placekitten.com/450/450',
    description: `${faker.lorem.sentence()}`,
    user: {
      countryCode: faker.location.countryCode('alpha-2'),
      userName: faker.internet.userName(),
      isSupporter: faker.datatype.boolean(),
      isVerified: faker.datatype.boolean(),
    },
    heading: `${faker.lorem.word()}`,
    isEditable: false,
  },
}

export const ModerationComments = {
  args: {
    imageUrl: 'https://placekitten.com/450/450',
    description: `${faker.lorem.sentence()}`,
    comments: `${faker.lorem.sentence()}`,
    user: {
      countryCode: faker.location.countryCode('alpha-2'),
      userName: faker.internet.userName(),
      isSupporter: faker.datatype.boolean(),
      isVerified: faker.datatype.boolean(),
    },
    heading: `${faker.lorem.word()}`,
    isEditable: false,
  },
}
