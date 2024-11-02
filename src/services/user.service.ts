import { collection, getDocs, query, where } from 'firebase/firestore'
import { DB_ENDPOINTS, IModerationStatus, profileTags } from 'oa-shared'
import { firestore } from 'src/utils/firebase'

import type { IHowtoDB, IResearchDB, ITag, IUserDB } from 'oa-shared'
import type { UserCreatedDocs } from 'src/pages/User/types'

const getProfileTags = (): ITag[] => {
  return profileTags
}

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
  const [howtos, research, researchCollaborated] = await Promise.all([
    getHowtosByAuthor(userId),
    getResearchByAuthor(userId),
    getResearchByCollaborator(userId),
  ])

  const researchCombined = [...research, ...researchCollaborated].filter(
    (item, index, self) => index === self.findIndex((t) => t._id === item._id),
  )
  const howtosFiltered = howtos.filter(
    (doc) => doc.moderation === IModerationStatus.ACCEPTED,
  )
  const researchFiltered = researchCombined.filter(
    (doc) => doc.moderation === IModerationStatus.ACCEPTED,
  )

  return {
    howtos: howtosFiltered,
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

const getHowtosByAuthor = async (userId: string) => {
  return (
    await getDocs(
      query(
        collection(firestore, DB_ENDPOINTS.howtos),
        where('_createdBy', '==', userId),
      ),
    )
  ).docs.map((doc) => doc.data() as IHowtoDB)
}

export const userService = {
  getById,
  getProfileTags,
  getUserCreatedDocs,
}
