import { faker } from '@faker-js/faker';

import type { News } from 'oa-shared';

export const FactoryNewsItem = (newsOverloads: Partial<News> = {}): News => ({
  body: faker.lorem.paragraph(),
  bodyHtml: faker.lorem.paragraph(),
  createdAt: faker.date.past(),
  deleted: faker.datatype.boolean(),
  id: faker.number.int(),
  isDraft: false,
  modifiedAt: faker.date.past(),
  previousSlugs: [],
  summary: null,
  slug: faker.lorem.slug(),
  title: faker.lorem.sentence(),
  tags: [
    {
      createdAt: new Date(),
      id: faker.number.int(),
      name: faker.lorem.words(1),
      modifiedAt: null,
    },
    {
      createdAt: new Date(),
      id: faker.number.int(),
      name: faker.lorem.words(1),
      modifiedAt: null,
    },
  ],
  author: {
    id: faker.number.int(),
    country: faker.location.countryCode(),
    displayName: faker.internet.username(),
    badges: [
      {
        id: 1,
        name: 'pro',
        displayName: 'PRO',
        imageUrl: faker.image.avatar(),
      },
      {
        id: 2,
        name: 'supporter',
        displayName: 'Supporter',
        actionUrl: faker.internet.url(),
        imageUrl: faker.image.avatar(),
      },
    ],
    photo: {
      id: faker.string.uuid(),
      publicUrl: faker.image.avatar(),
    },
    username: faker.internet.username(),
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
  profileBadge: null,
  publishedAt: faker.date.past(),
  ...newsOverloads,
});
