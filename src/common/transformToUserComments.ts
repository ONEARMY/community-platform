import type { IDiscussionComment, IUserPPDB } from 'src/models'

export const transformToUserComments = (
  comments: IDiscussionComment[],
  loggedInUser: IUserPPDB | null | undefined,
): IDiscussionComment[] =>
  comments?.map((c) => ({
    ...c,
    isEditable: c._creatorId === loggedInUser?._id,
  })) || []
