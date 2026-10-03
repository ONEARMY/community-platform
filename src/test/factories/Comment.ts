import { faker } from '@faker-js/faker';

import type { AdminComment, Comment, DiscussionContentType } from 'oa-shared';

export const FactoryComment = (commentOverloads: Partial<Comment> = {}): Comment => ({
  id: faker.number.int(),
  createdAt: faker.date.past(),
  modifiedAt: faker.date.past(),
  createdBy: {
    id: faker.number.int(),
    displayName: faker.person.firstName(),
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
    username: faker.internet.username(),
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
  sourceType: faker.helpers.arrayElement<DiscussionContentType>([
    'news',
    'projects',
    'questions',
    'research_updates',
  ]),
  voteCount: faker.number.int({ min: 0, max: 100 }),
  hasVoted: faker.datatype.boolean(),
  ...commentOverloads,
});

export const FactoryAdminComment = (overloads: Partial<AdminComment> = {}): AdminComment => ({
  id: faker.number.int(),
  sourceId: 1,
  liveUrl: '/questions/example#comment:1',
  comment: faker.lorem.paragraph(),
  sourceType: faker.helpers.arrayElement<DiscussionContentType>([
    'news',
    'projects',
    'questions',
    'research_updates',
  ]),
  isReply: false,
  createdAt: faker.date.past(),
  deleted: false,
  author: { username: faker.internet.username(), displayName: faker.person.firstName() },
  notificationCount: faker.number.int({ min: 0, max: 20 }),
  ...overloads,
});
