import { faker } from '@faker-js/faker'
import type { IQuestion } from 'src/models'

export const FactoryQuestionItem = (
  questionOverloads: Partial<IQuestion.Item> = {},
): IQuestion.Item => ({
  _id: faker.datatype.uuid(),
  _created: faker.date.past().toString(),
  _deleted: faker.datatype.boolean(),
  _createdBy: faker.internet.userName(),
  title: faker.lorem.words(3),
  slug: faker.lorem.slug(3),
  description: faker.lorem.sentences(10),
  moderation: faker.helpers.arrayElement([
    'draft',
    'awaiting-moderation',
    'rejected',
    'accepted',
  ]),
  ...questionOverloads,
})
