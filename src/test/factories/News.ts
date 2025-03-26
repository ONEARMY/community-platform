import { faker } from '@faker-js/faker'

import type { News } from 'oa-shared'

export const FactoryNewsItem = (newsOverloads: Partial<News> = {}): News => ({
  id: faker.number.int(),
  createdAt: faker.date.past(),
  deleted: faker.datatype.boolean(),
  modifiedAt: faker.date.past(),
  title: faker.lorem.sentence(),
  body: faker.lorem.paragraph(),
  slug: faker.lorem.slug(),
  previousSlugs: [],
  tags: [
    {
      id: faker.number.int(),
      name: faker.lorem.words(1),
    },
    {
      id: faker.number.int(),
      name: faker.lorem.words(1),
    },
  ],
  author: {
    id: faker.number.int(),
    name: faker.internet.userName(),
    country: faker.location.countryCode(),
    isVerified: faker.datatype.boolean(),
    isSupporter: faker.datatype.boolean(),
    firebaseAuthId: faker.string.uuid(),
    photoUrl: faker.image.avatar(),
    username: faker.internet.userName(),
  },
  category: {
    createdAt: new Date(),
    modifiedAt: null,
    id: faker.number.int(),
    name: faker.lorem.words(1),
    type: 'news',
  },
  heroImage: { id: '2349-23480-34', publicUrl: '' },
  subscriberCount: faker.number.int(),
  commentCount: faker.number.int(),
  totalViews: faker.number.int(),
  usefulCount: faker.number.int(),
  ...newsOverloads,
})
