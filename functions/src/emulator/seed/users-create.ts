import { MOCK_AUTH_USERS } from 'oa-shared/mocks/auth'
import type { IUserDB } from '../../models'
import { firebaseAuth } from '../../Firebase/auth'
import { setDoc } from '../../Firebase/firestoreDB'

/**
 * Create auth users to allow sign-in on firebase emulators
 */
export async function seedUsersCreate() {
  const auth = firebaseAuth
  const createdUsers = []
  for (const user of Object.values(MOCK_AUTH_USERS)) {
    const { label, roles, email, password, uid } = user
    if (email && password) {
      // check if the user already exists, if yes update
      try {
        const authUser = await auth.getUserByEmail(user.email)
        if (authUser) {
          const updatedUser = await auth.updateUser(authUser.uid, {
            displayName: label,
          })
          createdUsers.push(updatedUser.toJSON())
        }
        // create user if does not exist
      } catch (error) {
        const createdUser = await auth.createUser({
          displayName: label,
          email,
          password,
          uid,
        })
        createdUsers.push(createdUser.toJSON())
      }
    }
    // assign user doc
    const dbUser: IUserDB = {
      _authID: uid,
      _id: uid,
      _created: '2022-01-30T18:51:57.719Z',
      _modified: '2022-01-30T18:51:57.719Z',
      _deleted: false,
      displayName: user.label,
      userName: uid,
      moderation: 'awaiting-moderation',
      votedUsefulHowtos: {},
      votedUsefulResearch: {},
      notifications: [],
      userRoles: roles,
      links: [],
      ['profileType' as any]: 'member', // include pp profile field
      coverImages: [],
      verified: true,
    }
    await setDoc('users', uid, dbUser)
  }
  return createdUsers
}
