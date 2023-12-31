import { faker } from '@faker-js/faker'
import type { IDiscussion, IDiscussionComment } from 'src/models'
import { FactoryComment } from './Comment'

export const FactoryDiscussion = (
  discussionOverloads: Partial<IDiscussion> = {},
): IDiscussion => ({
  _id: faker.datatype.uuid(),
  comments: [],
  sourceId: faker.datatype.uuid(),
  sourceType: 'question',
  ...discussionOverloads,
})

export const FactoryDiscussionComment = (
  discussionCommentOverloads: Partial<IDiscussionComment> = {},
) => {
  const { parentCommentId = null, ...overload } = discussionCommentOverloads
  return {
    ...FactoryComment(overload),
    parentCommentId,
  }
}
