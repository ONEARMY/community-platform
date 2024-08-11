/* eslint-disable no-case-declarations */
import { toJS } from 'mobx'
import { ResearchUpdateStatus } from 'oa-shared'
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

export const liveResearchUpdatesCommentCounts = (
  updates: IResearch.Update[],
) => {
  if (!updates) return 0

  const publishedUpdates = updates.filter(
    ({ status, _deleted }) =>
      status === ResearchUpdateStatus.PUBLISHED && _deleted != true,
  )

  const updatesCommentCount = publishedUpdates.map(
    ({ commentCount }) => commentCount || 0,
  )

  return updatesCommentCount.reduce((sum, current) => sum + current, 0)
}

export const updateDiscussionMetadata = async (
  db: DatabaseV2,
  discussion: IDiscussion,
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
    case 'howtos':
      return await db
        .collection(collectionName)
        .doc(sourceId)
        .update({
          totalComments: commentCount,
          ...(latestCommentDate ? { latestCommentDate } : {}),
        })
    case 'research':
      const researchRef = db.collection('research').doc(primaryContentId)
      const research = toJS(await researchRef.get('server')) as IResearch.Item

      if (!research || !research.updates || research.updates.length === 0) {
        return
      }

      const updates = research.updates.map((update) => {
        return update._id === sourceId ? { ...update, commentCount } : update
      })

      const totalCommentCount = liveResearchUpdatesCommentCounts(updates)

      return await researchRef.update({
        totalCommentCount,
        updates,
        ...(latestCommentDate ? { latestCommentDate } : {}),
      })
    default:
      return await db
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
