/* eslint-disable no-case-declarations */
import { toJS } from 'mobx'
import { logger } from 'src/logger'
import { filterNonDeletedComments } from 'src/utils/filterNonDeletedComments'

import type { IDiscussion, IResearch } from 'src/models'
import type { DatabaseV2 } from '../databaseV2/DatabaseV2'
import type { DBEndpoint } from '../databaseV2/endpoints'

export type DiscussionEndpoints = Extract<
  DBEndpoint,
  'howtos' | 'research' | 'questions'
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
  commentsTotalEvent: CommentsTotalEvent,
) => {
  const { comments, primaryContentId, sourceId, sourceType } = discussion
  const collectionName = getCollectionName(sourceType)

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

  switch (collectionName) {
    case 'research':
      const researchRef = db.collection(collectionName).doc(primaryContentId)

      const research = toJS(await researchRef.get('server')) as IResearch.Item

      if (research) {
        // This approach is open to error but is better than making lots of DBs
        // reads to get the all the counts of all discussions for a research
        // item.
        const countChange = {
          add: research.totalCommentCount + 1,
          delete: research.totalCommentCount - 1,
          neutral: research.totalCommentCount,
        }

        researchRef.update({
          totalCommentCount: countChange[commentsTotalEvent],
          ...(latestCommentDate ? { latestCommentDate } : {}),
        })
      }
      return
    case 'howtos':
      return db
        .collection(collectionName)
        .doc(sourceId)
        .update({
          totalComments: commentCount,
          ...(latestCommentDate ? { latestCommentDate } : {}),
        })
    default:
      return db
        .collection(collectionName)
        .doc(sourceId)
        .update({
          commentCount,
          ...(latestCommentDate ? { latestCommentDate } : {}),
        })
  }
}

export const getCollectionName = (
  sourceType: string,
): DiscussionEndpoints | null => {
  switch (sourceType) {
    case 'question':
      return 'questions'
    case 'howto':
      return 'howtos'
    case 'researchUpdate':
      return 'research'
    default:
      return null
  }
}
