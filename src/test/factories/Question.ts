import { faker } from '@faker-js/faker'
import type { IQuestion } from 'src/models'

export const FactoryQuestionItem = (
  questionOverloads: Partial<IQuestion.Item> = {},
): IQuestion.Item => ({
  _id: faker.datatype.uuid(),
  _created: faker.date.past().toString(),
  _deleted: faker.datatype.boolean(),
  _contentModifiedTimestamp: faker.date.past().toString(),
  _createdBy: faker.internet.userName(),
  title: faker.lorem.sentence(),
  slug: faker.lorem.slug(),
  ...questionOverloads,
})
