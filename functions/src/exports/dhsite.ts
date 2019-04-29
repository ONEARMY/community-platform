import * as functions from 'firebase-functions'
import DHSite from '../DaveHakkensNL'

export const DHSite_getUser = functions.https.onCall(
  async (mention_name: string) => {
    console.log('getting DH user profile', mention_name)
    try {
      const profile = await DHSite.getDHUserProfile(mention_name)
      return profile
    } catch (error) {
      throw new functions.https.HttpsError('not-found', error.message)
    }
  },
)

export const DHSite_migrateAvatar = functions.https.onCall(
  async ({ avatarUrl, user }) => {
    console.log('migrating user avatar', user, avatarUrl)
    try {
      const meta = await DHSite.migrateAvatar(avatarUrl, user)
      return meta
    } catch (error) {
      throw new functions.https.HttpsError('not-found', error.message)
    }
  },
)
