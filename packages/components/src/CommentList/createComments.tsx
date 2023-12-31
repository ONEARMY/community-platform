import type { CommentItemProps as Comment } from '../CommentItem/CommentItem'
import { faker } from '@faker-js/faker'

export const createComments = (
  numberOfComments = 2,
  commentOverloads = {},
): Comment[] =>
  [...Array(numberOfComments).keys()].slice(0).map(() => ({
    _created: faker.date.past().toString(),
    creatorCountry: faker.address.countryCode().toLowerCase(),
    _creatorId: faker.internet.userName(),
    _id: faker.database.mongodbObjectId(),
    creatorName: faker.internet.userName(),
    isUserVerified: faker.datatype.boolean(),
    text: faker.lorem.text(),
    isEditable: faker.datatype.boolean(),
    ...commentOverloads,
  }))
