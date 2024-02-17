import { logger } from 'src/logger'

import type { IDiscussion } from 'src/models'
import type { DatabaseV2 } from '../databaseV2/DatabaseV2'
import type { DBEndpoint } from '../databaseV2/endpoints'

type DiscussionEndpoints = Extract<
  DBEndpoint,
  'howtos' | 'research' | 'questions'
>

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
  const latestCommentDate = new Date(
    Math.max(
      ...discussion.comments.map((comment) =>
        new Date(comment._created).valueOf(),
      ),
    ),
  )

  return db
    .collection(collectionName)
    .doc(discussion.sourceId)
    .update({ commentCount, latestCommentDate })
}

const getCollectionName = (sourceType: string): DiscussionEndpoints | null => {
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
