/* eslint-disable no-case-declarations */
import { toJS } from 'mobx'
import { logger } from 'src/logger'

import type { IDiscussion } from 'src/models'
import type { DatabaseV2 } from '../databaseV2/DatabaseV2'
import type { DBEndpoint } from '../databaseV2/endpoints'

export type DiscussionEndpoints = Extract<
  DBEndpoint,
  'howtos' | 'research' | 'questions'
>

export type CommentsTotalEvent = 'add' | 'delete' | 'neutral'

const calculateLastestCommentDate = (comments) => {
  return new Date(
    Math.max(
      ...comments.map((comment) => new Date(comment._created).valueOf()),
    ),
  )
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

  const commentCount = comments.length
  const latestCommentDate =
    commentCount > 0 ? calculateLastestCommentDate(comments) : undefined

  switch (collectionName) {
    case 'research':
      const researchRef = db.collection(collectionName).doc(primaryContentId)

      const research = toJS(await researchRef.get())

      // This approach is open to error but is better than making lots of DBs
      // reads to get the all the counts of all discussions for a research
      // item.
      const countChange = {
        add: commentCount + 1,
        delete: commentCount - 1,
        neutral: commentCount,
      }

      if (research) {
        researchRef.update({
          commentCount: countChange[commentsTotalEvent],
          ...(latestCommentDate ? { latestCommentDate } : {}),
        })
      }
      return
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
    case 'research':
      return 'research'
    default:
      return null
  }
}
