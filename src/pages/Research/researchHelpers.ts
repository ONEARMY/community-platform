import { ResearchStatus, ResearchUpdateStatus } from 'oa-shared'

import type { IResearch } from 'src/models'

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
