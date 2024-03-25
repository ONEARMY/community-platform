import { logger } from 'src/logger'

import type { IDiscussion } from 'src/models'
import type { DatabaseV2 } from '../databaseV2/DatabaseV2'
import type { DBEndpoint } from '../databaseV2/endpoints'

export type DiscussionEndpoints = Extract<
  DBEndpoint,
  'howtos' | 'research' | 'questions'
>
const calculateLastestCommentDate = (comments) => {
  return new Date(
    Math.max(
      ...comments.map((comment) => new Date(comment._created).valueOf()),
    ),
  )
}

export const updateDiscussionMetadata = (
  db: DatabaseV2,
  discussion: IDiscussion,
) => {
  const collectionName = getCollectionName(discussion.sourceType)

  if (!collectionName) {
    logger.trace(
      `Unable to find collection. Discussion metadata was not updated. sourceType: ${discussion.sourceType}`,
    )
    return
  }

  const commentCount = discussion.comments.length
  const latestCommentDate =
    commentCount > 0
      ? calculateLastestCommentDate(discussion.comments)
      : undefined

  return db
    .collection(collectionName)
    .doc(discussion.sourceId)
    .update({
      commentCount,
      ...(latestCommentDate ? { latestCommentDate } : {}),
    })
}

export const getCollectionName = (
  sourceType: string,
): DiscussionEndpoints | null => {
  switch (sourceType) {
    case 'question':
      return 'questions'
    case 'howto':
      return 'howtos'
    case 'research':
      return 'research'
    default:
      return null
  }
}
