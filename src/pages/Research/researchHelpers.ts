import type { Author, DBProfile, ResearchItem, ResearchStatus, ResearchUpdate } from 'oa-shared';
import { UserRole } from 'oa-shared';

export const researchUpdateStatusFilter = (
  author: Author | null,
  collaborators: Author[] | null,
  update: ResearchUpdate,
  currentUser?: DBProfile,
) => {
  const isCollaborator =
    currentUser?.id && collaborators && collaborators.map((x) => x.id).includes(currentUser.id);

  const isAuthor = author?.id && author?.id === currentUser?.id;
  const isAdmin = currentUser?.roles?.includes(UserRole.ADMIN);

  return (isAdmin || isAuthor || isCollaborator || !update.isDraft) && !update.deleted;
};

export const getPublicUpdates = (item: ResearchItem, currentUser?: DBProfile) => {
  if (item.updates) {
    return item.updates.filter((update) =>
      researchUpdateStatusFilter(item.author, item.collaborators, update, currentUser),
    );
  } else {
    return [];
  }
};

export const researchStatusColour = (researchStatus?: ResearchStatus): string => {
  switch (researchStatus) {
    case 'complete':
      return 'betaGreen';
    default:
      return 'softblue';
  }
};
