import { faker } from '@faker-js/faker'

import { FactoryComment } from './Comment'

import type { IDiscussion, IDiscussionComment } from 'src/models'

export const FactoryDiscussion = (
  discussionOverloads: Partial<IDiscussion> = {},
  comments: IDiscussionComment[] = [],
): IDiscussion => ({
  _id: faker.string.uuid(),
  comments,
  contributorIds: [],
  sourceId: faker.string.uuid(),
  primaryContentId: faker.string.uuid(),
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
