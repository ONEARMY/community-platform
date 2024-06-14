import type { IComment, IUserPPDB } from 'src/models'

export const transformToUserComments = (
  comments: IComment[],
  loggedInUser: IUserPPDB | null | undefined,
): IComment[] =>
  comments?.map((c) => ({
    ...c,
    isEditable: c._creatorId === loggedInUser?._id,
  })) || []
