import { ResearchStatus, ResearchUpdateStatus, UserRole } from 'oa-shared'

import type { IResearch, IUserPPDB } from 'src/models'

export const researchUpdateStatusFilter = (
  item: IResearch.Item,
  update: IResearch.Update,
  currentUser?: IUserPPDB | null,
) => {
  const isCollaborator =
    currentUser?._id &&
    item.collaborators &&
    item.collaborators.includes(currentUser?._id)

  const isAuthor = item._createdBy === currentUser?._id
  const isAdmin = currentUser?.userRoles?.includes(UserRole.ADMIN)
  const isUpdateDraft = update.status === ResearchUpdateStatus.DRAFT
  const isUpdateDeleted = update._deleted

  return (
    (isAdmin || isAuthor || isCollaborator || !isUpdateDraft) &&
    !isUpdateDeleted
  )
}

export const getPublicUpdates = (
  item: IResearch.Item,
  currentUser?: IUserPPDB | null,
) => {
  if (item.updates) {
    return item.updates.filter((update) =>
      researchUpdateStatusFilter(item, update, currentUser),
    )
  } else {
    return []
  }
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
