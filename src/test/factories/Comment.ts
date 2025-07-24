import { faker } from '@faker-js/faker'

import type { Comment, DiscussionContentTypes } from 'oa-shared'

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
    photo: {
      id: faker.string.uuid(),
      publicUrl: faker.image.avatar(),
    },
    country: faker.location.countryCode(),
  },
  parentId: faker.number.int(),
  comment: faker.lorem.paragraph(),
  deleted: faker.datatype.boolean(),
  sourceId: faker.number.int(),
  sourceType: faker.helpers.arrayElement<DiscussionContentTypes>([
    'news',
    'projects',
    'questions',
    'research_update',
  ]),
  ...commentOverloads,
})
