import type { IDiscussionComment, IUserPPDB } from 'src/models'

export const transformToUserComments = (
  comments: IDiscussionComment[],
  loggedInUser: IUserPPDB | null | undefined,
) =>
  comments.map((c) => ({
    ...c,
    isEditable: c._creatorId === loggedInUser?._id,
  }))
