import { MOCK_AUTH_USERS } from 'oa-shared'
import { firebaseAdmin } from '../../Firebase/admin'
import { setDoc } from '../../Firebase/firestoreDB'

/**
 * Create auth users to allow sign-in on firebase emulators
 */
export async function seedUsersCreate() {
  const auth = firebaseAdmin.auth()
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
    // assign roles to firestore
    await setDoc('users', uid, { roles })
  }
  return createdUsers
}
