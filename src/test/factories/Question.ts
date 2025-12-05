import { faker } from '@faker-js/faker';

import type { Question } from 'oa-shared';

export const FactoryQuestionItem = (questionOverloads: Partial<Question> = {}): Question => ({
  id: faker.number.int(),
  isDraft: false,
  createdAt: faker.date.past(),
  deleted: faker.datatype.boolean(),
  modifiedAt: faker.date.past(),
  title: faker.lorem.sentence(),
  description: faker.lorem.paragraph(),
  slug: faker.lorem.slug(),
  previousSlugs: [],
  tags: [
    {
      createdAt: new Date(),
      id: faker.number.int(),
      modifiedAt: null,
      name: faker.lorem.words(1),
    },
    {
      createdAt: new Date(),
      id: faker.number.int(),
      modifiedAt: null,
      name: faker.lorem.words(1),
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
    type: 'questions',
  },
  images: [],
  subscriberCount: faker.number.int(),
  commentCount: faker.number.int(),
  totalViews: faker.number.int(),
  usefulCount: faker.number.int(),
  ...questionOverloads,
});
