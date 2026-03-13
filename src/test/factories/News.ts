import { faker } from '@faker-js/faker';

import type { News, NewsFormData } from 'oa-shared';

export const FactoryNewsFormData = (overloads: Partial<NewsFormData> = {}): NewsFormData => ({
  body: faker.lorem.paragraph(),
  category: {
    label: faker.lorem.words(1),
    value: faker.number.int().toString(),
  },
  heroImage: {
    id: faker.string.uuid(),
    path: faker.image.url(),
    fullPath: faker.image.url(),
    publicUrl: faker.image.url(),
  },
  isDraft: false,
  profileBadge: null,
  tags: [faker.number.int(), faker.number.int()],
  title: faker.lorem.sentence(),
  ...overloads,
});

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
  ...newsOverloads,
});
