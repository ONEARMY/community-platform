import { collection, getDocs, query, where } from 'firebase/firestore'
import {
  DB_ENDPOINTS,
  EmailNotificationFrequency,
  IModerationStatus,
} from 'oa-shared'
import { firestore } from 'src/utils/firebase'

import type { SupabaseClient, User } from '@supabase/supabase-js'
import type { ILibrary, IUser, IUserDB } from 'oa-shared'

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

const getUserCreatedProjects = async (
  userId: string,
): Promise<ILibrary.DB[]> => {
  const projects = await getLibraryByAuthor(userId)

  return projects.filter((doc) => doc.moderation === IModerationStatus.ACCEPTED)
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

const getProfileIdForAuthUser = async (
  client: SupabaseClient,
  userId: string,
) => {
  const { data: profileData } = await client
    .from('profiles')
    .select('id')
    .eq('auth_id', userId)
    .single()

  return profileData?.id
}

const deleteSupabaseUser = async (client: SupabaseClient, userId: string) => {
  await client.auth.admin.deleteUser(userId)
}

const deleteProfileData = async (client: SupabaseClient, userId: string) => {
  return await client.from('profiles').delete().eq('auth_id', userId)
}

const updateUserContent = async (client: SupabaseClient, profileId: string) => {
  const content = ['research', 'library', 'questions', 'news']

  content.forEach(async (contentType) => {
    await client
      .from(contentType)
      .update({ created_by: null })
      .eq('created_by', profileId)
  })

  // TODO - update research updates
}

const deleteUserContent = async (client: SupabaseClient, profileId: string) => {
  const contentStructure = [
    { contentType: 'subscribers', fieldNames: ['user_id'] },
    { contentType: 'useful_votes', fieldNames: ['user_id'] },
    { contentType: 'notifications', fieldNames: ['owned_by_id', 'triggered_by_id'] },
    { contentType: 'comments', fieldNames: ['created_by'] },
  ]

  contentStructure.forEach(({ contentType, fieldNames }) => {
    fieldNames.forEach(async (fieldName) => {
      await client
        .from(contentType)
        .delete()
        .eq(fieldName, profileId)
    })
  })
}

const logout = async (client: SupabaseClient, headers: Headers) => {
  const { error } = await client.auth.signOut()

  if (error) {
    return Response.json({ success: false }, { headers })
  }

  return Response.json({}, { headers, status: 200 })
}

export const userService = {
  getById,
  getUserCreatedProjects,
  createFirebaseProfile,
  getProfileIdForAuthUser,
  deleteProfileData,
  deleteSupabaseUser,
  updateUserContent,
  deleteUserContent,
  logout,
}
