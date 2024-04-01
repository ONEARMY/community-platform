import { faker } from '@faker-js/faker'

import { FactoryComment } from './Comment'

import type { IDiscussion, IDiscussionComment } from 'src/models'

export const FactoryDiscussion = (
  discussionOverloads: Partial<IDiscussion> = {},
): IDiscussion => ({
  _id: faker.string.uuid(),
  comments: [],
  sourceId: faker.string.uuid(),
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
