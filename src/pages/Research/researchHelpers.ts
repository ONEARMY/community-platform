import { ResearchStatus, ResearchUpdateStatus } from 'oa-shared'

import type { IResearch } from 'src/models'

export const getResearchTotalCommentCount = (
  item: IResearch.ItemDB,
): number => {
  if (Object.hasOwnProperty.call(item, 'totalCommentCount')) {
    return item.totalCommentCount || 0
  }

  if (item.updates) {
    const commentOnUpdates = item.updates.reduce((totalComments, update) => {
      const updateCommentsLength =
        !update._deleted &&
        update.status !== ResearchUpdateStatus.DRAFT &&
        update.comments
          ? update.comments.length
          : 0
      return totalComments + updateCommentsLength
    }, 0)

    return commentOnUpdates ? commentOnUpdates : 0
  } else {
    return 0
  }
}

export const researchUpdateStatusFilter = (
  item: IResearch.Item,
  update: IResearch.Update,
  currentUserId?: string,
) => {
  const isCollaborator =
    currentUserId &&
    item.collaborators &&
    item.collaborators.includes(currentUserId)

  const isAuthor = item._createdBy === currentUserId
  const isUpdateDraft = update.status === ResearchUpdateStatus.DRAFT
  const isUpdateDeleted = update._deleted

  return (isAuthor || isCollaborator || !isUpdateDraft) && !isUpdateDeleted
}

export const getPublicUpdates = (
  item: IResearch.Item,
  currentUserId?: string,
) => {
  if (item.updates) {
    return item.updates.filter((update) =>
      researchUpdateStatusFilter(item, update, currentUserId),
    )
  } else {
    return []
  }
}

export const researchStatusColour = (
  researchStatus?: ResearchStatus,
): string => {
  return researchStatus === ResearchStatus.ARCHIVED
    ? 'lightgrey'
    : researchStatus === ResearchStatus.COMPLETED
    ? 'betaGreen'
    : 'accent.base'
}
