import { toJS } from 'mobx'

import type { IUserDB, UserRole } from 'src/models'
import type { DatabaseV2 } from '../databaseV2/DatabaseV2'

export const setCollaboratorPermission = async (
  db: DatabaseV2,
  userId: string,
) => {
  const userRef = db.collection<IUserDB>('users').doc(userId)
  const user = toJS(await userRef.get())
  const role = 'research_creator' as UserRole.RESEARCH_CREATOR

  if (!user) return

  if (user.userRoles) {
    const roleAlreadyPresent = user.userRoles.includes(role)

    if (roleAlreadyPresent) return

    return await userRef.update({
      userRoles: [...user.userRoles, role],
    })
  }

  return await userRef.update({
    userRoles: [role],
  })
}
