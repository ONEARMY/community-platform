import { faker } from '@faker-js/faker'

import type { IModerationStatus } from '@onearmy.apps/shared'
import type { IQuestionItem } from '../../models'

export const FactoryQuestionItem = (
  questionOverloads: Partial<IQuestionItem> = {},
): IQuestionItem => ({
  _id: faker.string.uuid(),
  _created: faker.date.past().toString(),
  _deleted: faker.datatype.boolean(),
  _contentModifiedTimestamp: faker.date.past().toString(),
  _createdBy: faker.internet.userName(),
  _modified: faker.date.past().toString(),
  title: faker.lorem.sentence(),
  description: faker.lorem.paragraph(),
  slug: faker.lorem.slug(),
  moderation: 'accepted' as IModerationStatus.ACCEPTED,
  tags: {},
  ...questionOverloads,
})
