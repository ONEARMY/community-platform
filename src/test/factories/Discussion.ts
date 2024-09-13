import { faker } from '@faker-js/faker'

import { FactoryComment } from './Comment'

import type { IComment, IDiscussion } from 'src/models'

export const FactoryDiscussion = (
  discussionOverloads: Partial<IDiscussion> = {},
  comments: IComment[] = [],
): IDiscussion => ({
  _id: faker.string.uuid(),
  comments,
  contributorIds: comments.map((comment) => comment._creatorId),
  sourceId: faker.string.uuid(),
  primaryContentId: faker.string.uuid(),
  sourceType: 'question',
  ...discussionOverloads,
})

export const FactoryDiscussionComment = (
  discussionCommentOverloads: Partial<IComment> = {},
) => {
  const { parentCommentId = null, ...overload } = discussionCommentOverloads
  return {
    ...FactoryComment(overload),
    parentCommentId,
  }
}
