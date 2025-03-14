import { collection, getDocs, query, where } from 'firebase/firestore'
import {
  DB_ENDPOINTS,
  EmailNotificationFrequency,
  IModerationStatus,
} from 'oa-shared'
import { firestore } from 'src/utils/firebase'

import type { User } from '@supabase/supabase-js'
import type { ILibrary, IResearchDB, IUser, IUserDB } from 'oa-shared'
import type { UserCreatedDocs } from 'src/pages/User/types'

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

const getUserCreatedDocs = async (userId: string): Promise<UserCreatedDocs> => {
  const [library, research, researchCollaborated] = await Promise.all([
    getLibraryByAuthor(userId),
    getResearchByAuthor(userId),
    getResearchByCollaborator(userId),
  ])

  const researchCombined = [...research, ...researchCollaborated].filter(
    (item, index, self) => index === self.findIndex((t) => t._id === item._id),
  )
  const libraryFiltered = library.filter(
    (doc) => doc.moderation === IModerationStatus.ACCEPTED,
  )
  const researchFiltered = researchCombined.filter(
    (doc) => doc.moderation === IModerationStatus.ACCEPTED,
  )

  return {
    library: libraryFiltered,
    research: researchFiltered,
  }
}

const getResearchByAuthor = async (userId: string) => {
  return (
    await getDocs(
      query(
        collection(firestore, DB_ENDPOINTS.research),
        where('_createdBy', '==', userId),
      ),
    )
  ).docs.map((doc) => doc.data() as IResearchDB)
}

const getResearchByCollaborator = async (userId: string) => {
  return (
    await getDocs(
      query(
        collection(firestore, DB_ENDPOINTS.research),
        where('collaborators', 'array-contains', userId),
      ),
    )
  ).docs.map((doc) => doc.data() as IResearchDB)
}

const getLibraryByAuthor = async (userId: string) => {
  return (
    await getDocs(
      query(
        collection(firestore, DB_ENDPOINTS.library),
        where('_createdBy', '==', userId),
      ),
    )
  ).docs.map((doc) => doc.data() as ILibrary.DB)
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
  getUserCreatedDocs,
  createFirebaseProfile,
}
