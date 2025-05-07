/* eslint-disable no-case-declarations */
import { logger } from 'src/logger'
import { filterNonDeletedComments } from 'src/utils/filterNonDeletedComments'

import type { IDiscussion } from 'oa-shared'
import type { DatabaseV2 } from '../databaseV2/DatabaseV2'
import type { DBEndpoint } from '../databaseV2/endpoints'

export type DiscussionEndpoints = Extract<
  DBEndpoint,
  'library' | 'research' | 'questions'
>

export type CommentsTotalEvent = 'add' | 'delete' | 'neutral'

const calculateLastestCommentDate = (comments): string => {
  return new Date(
    Math.max(
      ...comments.map((comment) => new Date(comment._created).valueOf()),
    ),
  ).toISOString()
}

export const updateDiscussionMetadata = async (
  db: DatabaseV2,
  discussion: IDiscussion,
) => {
  const { comments, sourceId, sourceType } = discussion
  const collectionName = 'library'

  if (!collectionName) {
    return logger.trace(
      `Unable to find collection. Discussion metadata was not updated. sourceType: ${sourceType}`,
    )
  }

  const nonDeletedComments = filterNonDeletedComments(comments)
  const commentCount = nonDeletedComments.length

  const latestCommentDate =
    commentCount > 0
      ? calculateLastestCommentDate(nonDeletedComments)
      : undefined

  return await db
    .collection(collectionName)
    .doc(sourceId)
    .update({
      totalComments: commentCount,
      ...(latestCommentDate ? { latestCommentDate } : {}),
    })
}

export const getCollectionName = (
  sourceType: string,
): DiscussionEndpoints | null => {
  switch (sourceType) {
    case 'question':
      return 'questions'
    case 'library':
      return 'library'
    case 'researchUpdate':
      return 'research'
    default:
      return null
  }
}
