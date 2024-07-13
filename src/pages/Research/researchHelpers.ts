import { ResearchStatus, ResearchUpdateStatus, UserRole } from 'oa-shared'

import type { IResearch, IUserPPDB } from 'src/models'

export const researchUpdateStatusFilter = (
  item: IResearch.Item,
  update: IResearch.Update,
  currentUser?: IUserPPDB | null,
): boolean => {
  const currentUserId = currentUser?._id

  const isCollaborator =
    currentUserId && item.collaborators?.includes(currentUserId)
  const isAuthor = item._createdBy === currentUserId
  const isAdmin = currentUser?.userRoles?.includes(UserRole.ADMIN)
  const isUpdateDraft = update.status === ResearchUpdateStatus.DRAFT
  const isUpdateDeleted = !!update._deleted

  return (
    (isAdmin || isAuthor || isCollaborator || !isUpdateDraft) &&
    !isUpdateDeleted
  )
}

export const getPublicUpdates = (
  item: IResearch.Item,
  currentUser?: IUserPPDB | null,
): IResearch.Update[] => {
  if (!item.updates) {
    return []
  }

  return item.updates.filter((update) =>
    researchUpdateStatusFilter(item, update, currentUser),
  )
}

export const researchStatusColour = (
  researchStatus?: ResearchStatus,
): string => {
  switch (researchStatus) {
    case ResearchStatus.ARCHIVED:
      return 'lightgrey'
    case ResearchStatus.COMPLETED:
      return 'betaGreen'
    default:
      return 'accent.base'
  }
}
