import { faker } from '@faker-js/faker'

import type { Author, Comment, News, Question } from 'oa-shared'
import type { IComment } from './CommentItem/types'

export const fakeAuthorSB = (
  authorOverloads: Partial<Author> = {},
): Author => ({
  id: faker.datatype.number(),
  country: faker.random.locale(),
  displayName: faker.name.firstName(),
  username: faker.internet.userName(),
  photoUrl: faker.internet.avatar(),
  isVerified: faker.datatype.boolean(),
  isSupporter: faker.datatype.boolean(),
  ...authorOverloads,
})

export const fakeComment = (commentOverloads: Partial<IComment> = {}) => ({
  _created: faker.date.past().toString(),
  creatorCountry: faker.address.countryCode().toLowerCase(),
  _creatorId: faker.internet.userName(),
  _id: faker.database.mongodbObjectId(),
  creatorName: faker.internet.userName(),
  isUserVerified: faker.datatype.boolean(),
  isUserSupporter: faker.datatype.boolean(),
  text: faker.lorem.text(),
  isEditable: faker.datatype.boolean(),
  creatorImage: faker.datatype.boolean() ? faker.image.avatar() : undefined,
  ...commentOverloads,
})

export const createFakeComments = (
  numberOfComments = 2,
  commentOverloads = {},
): IComment[] =>
  [...Array(numberOfComments).keys()].slice(0).map(() =>
    fakeComment({
      ...commentOverloads,
    }),
  )

export const fakeCommentSB = (
  commentOverloads: Partial<Comment> = {},
): Comment => ({
  id: 0,
  createdAt: new Date(),
  modifiedAt: new Date(),
  createdBy: null,
  comment: faker.lorem.text(),
  sourceId: 0,
  sourceType: 'questions',
  parentId: 0,
  deleted: false,
  highlighted: false,
  replies: [],
  ...commentOverloads,
})

export const fakeNewsSB = (newsOverloads: Partial<News> = {}): News => ({
  id: faker.datatype.number(),
  createdAt: faker.date.past(),
  modifiedAt: null,
  author: fakeAuthorSB(),
  category: null,
  commentCount: faker.datatype.number(100),
  deleted: false,
  title: faker.random.words(8),
  previousSlugs: [],
  slug: 'random-slug',
  subscriberCount: faker.datatype.number(20),
  summary: null,
  tags: [],
  totalViews: faker.datatype.number(100),
  usefulCount: faker.datatype.number(20),
  body: faker.random.words(50),
  heroImage: null,
  ...newsOverloads,
})

export const fakeQuestionSB = (
  questionOverloads: Partial<Question> = {},
): Question => ({
  id: faker.datatype.number(),
  createdAt: faker.date.past(),
  modifiedAt: null,
  author: fakeAuthorSB(),
  category: null,
  commentCount: faker.datatype.number(100),
  description: faker.random.words(20),
  deleted: false,
  images: [],
  title: faker.random.words(8),
  previousSlugs: [],
  slug: 'random-slug',
  subscriberCount: faker.datatype.number(20),
  tags: [],
  totalViews: faker.datatype.number(100),
  usefulCount: faker.datatype.number(20),
  ...questionOverloads,
})
