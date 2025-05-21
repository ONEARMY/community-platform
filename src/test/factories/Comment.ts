import { faker } from '@faker-js/faker'

import type { Comment, ContentType } from 'oa-shared'

export const FactoryComment = (
  commentOverloads: Partial<Comment> = {},
): Comment => ({
  id: faker.number.int(),
  createdAt: faker.date.past(),
  modifiedAt: faker.date.past(),
  createdBy: {
    id: faker.number.int(),
    displayName: faker.person.firstName(),
    isSupporter: faker.datatype.boolean(),
    isVerified: faker.datatype.boolean(),
    username: faker.internet.userName(),
    photoUrl: faker.image.url(),
    country: faker.location.countryCode(),
  },
  parentId: faker.number.int(),
  comment: faker.lorem.paragraph(),
  deleted: faker.datatype.boolean(),
  sourceId: faker.number.int(),
  sourceType: faker.helpers.arrayElement<ContentType>([
    'news',
    'projects',
    'questions',
    'research',
  ]),
  ...commentOverloads,
})
