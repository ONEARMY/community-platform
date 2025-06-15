import { collection, getDocs, query, where } from 'firebase/firestore'
import { DB_ENDPOINTS, EmailNotificationFrequency } from 'oa-shared'
import { firestore } from 'src/utils/firebase'

import type { User } from '@supabase/supabase-js'
import type { IUser, IUserDB } from 'oa-shared'

const getById = async (id: string): Promise<IUserDB | null> => {
  // Get all that match the slug, to avoid creating an index (blocker for cypress tests)
  const snapshot = await getDocs(
    query(collection(firestore, DB_ENDPOINTS.users), where('_id', '==', id)),
  )

  if (snapshot.size === 0) {
    return null
  }

  return snapshot.docs[0].data() as IUserDB
}

const createFirebaseProfile = async (authUser: User) => {
  const username = authUser.user_metadata.username
  const dbRef = firestore.doc(DB_ENDPOINTS.users + '/' + username)

  const user: IUser & { _id: string } = {
    _id: username,
    coverImages: [],
    verified: false,
    _authID: '',
    displayName: username,
    userName: username,
    notifications: [],
    profileCreated: new Date().toISOString(),
    profileType: 'member',
    notification_settings: {
      emailFrequency: EmailNotificationFrequency.WEEKLY,
    },
  }

  await dbRef.set(user)
}

export const userService = {
  getById,
  createFirebaseProfile,
}
