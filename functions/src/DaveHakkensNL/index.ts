import { migrateAvatar } from './avatarMigrate'
import { getDHUserProfile } from './dataMigrate'
import { DHLogin } from './login'

import * as functions from 'firebase-functions'

const DHSite_getUser = functions.https.onCall(async (mention_name: string) => {
  console.log('getting DH user profile', mention_name)
  try {
    const profile = await getDHUserProfile(mention_name)
    return profile
  } catch (error) {
    throw new functions.https.HttpsError('not-found', error.message)
  }
})

const DHSite_migrateAvatar = functions.https.onCall(
  async ({ avatarUrl, user }) => {
    console.log('migrating user avatar', user, avatarUrl)
    try {
      const meta = await migrateAvatar(avatarUrl, user)
      return meta
    } catch (error) {
      throw new functions.https.HttpsError('not-found', error.message)
    }
  },
)

const DHSite_login = functions.https.onCall(async ({ email, password }) => {
  try {
    const token = await DHLogin(email, password)
    return token
  } catch (error) {
    console.log(error.message)
    throw new functions.https.HttpsError('permission-denied', error.message)
  }
})

export const DH_Exports = { DHSite_getUser, DHSite_migrateAvatar, DHSite_login }
