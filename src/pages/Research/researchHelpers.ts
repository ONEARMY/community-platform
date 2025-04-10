import { ResearchStatus, ResearchUpdateStatus, UserRole } from 'oa-shared'

import type { Author, DBProfile, ResearchItem, ResearchUpdate } from 'oa-shared'

export const researchUpdateStatusFilter = (
  author: Author | null,
  collaborators: Author[] | null,
  update: ResearchUpdate,
  currentUser?: DBProfile,
) => {
  const isCollaborator =
    currentUser?.id &&
    collaborators &&
    collaborators.map((x) => x.id).includes(currentUser.id)

  const isAuthor = author?.id && author?.id === currentUser?.id
  const isAdmin = currentUser?.roles?.includes(UserRole.ADMIN)
  const isUpdateDraft = update.status === ResearchUpdateStatus.DRAFT
  const isUpdateDeleted = update.deleted

  return (
    (isAdmin || isAuthor || isCollaborator || !isUpdateDraft) &&
    !isUpdateDeleted
  )
}

export const getPublicUpdates = (
  item: ResearchItem,
  currentUser?: DBProfile,
) => {
  if (item.updates) {
    return item.updates.filter((update) =>
      researchUpdateStatusFilter(
        item.author,
        item.collaborators,
        update,
        currentUser,
      ),
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
