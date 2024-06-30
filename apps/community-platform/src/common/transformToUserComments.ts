import { UserRole } from '@onearmy.apps/shared'

import { type IComment, type IUserPPDB } from '../models'

export const transformToUserComments = (
  comments: IComment[],
  loggedInUser: IUserPPDB | null | undefined,
): IComment[] => {
  return (
    comments?.map((c) => ({
      ...c,
      isEditable:
        c._creatorId === loggedInUser?._id ||
        loggedInUser?.userRoles?.includes(UserRole.SUPER_ADMIN) ||
        loggedInUser?.userRoles?.includes(UserRole.ADMIN),
    })) || []
  )
}
