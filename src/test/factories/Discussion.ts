import { faker } from '@faker-js/faker'
import type { IDiscussion } from 'src/models'

export const FactoryDiscussion = (
  discussionOverloads: Partial<IDiscussion> = {},
): IDiscussion => ({
  _id: faker.datatype.uuid(),
  comments: [],
  sourceId: faker.datatype.uuid(),
  sourceType: 'howto',
  ...discussionOverloads,
})
