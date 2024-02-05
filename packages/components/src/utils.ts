import { faker } from '@faker-js/faker'

import type { IComment } from '.'

export const fakeComment = (commentOverloads: Partial<IComment> = {}) => ({
  _created: faker.date.past().toString(),
  creatorCountry: faker.address.countryCode().toLowerCase(),
  _creatorId: faker.internet.userName(),
  _id: faker.database.mongodbObjectId(),
  creatorName: faker.internet.userName(),
  isUserVerified: faker.datatype.boolean(),
  text: faker.lorem.text(),
  isEditable: faker.datatype.boolean(),
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
