import { faker } from '@faker-js/faker'
import type { IComment } from 'src/models'

export const FactoryComment = (
  commentOverloads: Partial<IComment> = {},
): IComment => ({
  _id: faker.datatype.uuid(),
  _created: faker.date.past().toString(),
  _edited: faker.date.past().toString(),
  _creatorId: faker.internet.userName(),
  creatorName: faker.internet.userName(),
  creatorCountry: '',
  text: faker.lorem.paragraph(),
  isUserVerified: faker.datatype.boolean(),
  ...commentOverloads,
})
