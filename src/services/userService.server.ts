import { redirect } from 'react-router'
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

const getProfileForAuthUser = async (
  client: SupabaseClient,
  userId: string,
) => {
  const { data: profileData } = await client
    .from('profiles')
    .select('*')
    .eq('auth_id', userId)
    .single()

  return profileData
}

const deleteSupabaseUser = async (client: SupabaseClient, userId: string) => {
  const { error } = await client.auth.admin.deleteUser(userId)

  if (error) {
    console.log(`Delete auth user failed (id ${userId})`, error)
  }
}

const deleteProfileData = async (client: SupabaseClient, userId: string) => {
  const { error } = await client.from('profiles').delete().eq('auth_id', userId)

  if (error) {
    console.log(`Delete profile failed (auth_id ${userId})`, error)
  }
}

const updateResearchUpdates = async (client, profileId) => {
  const { data: userResearchUpdates, error: fetchUpdatesError } = await client
    .from('research_updates')
    .select()
    .eq('created_by', profileId)

  if (fetchUpdatesError) {
    console.log(
      `Fetch research updates failed (profile ${profileId}).`,
      fetchUpdatesError,
    )
    return
  }

  for (const researchUpdate of userResearchUpdates || []) {
    const parentResearchId = researchUpdate.research_id

    const { data: parent, error: fetchParentError } = await client
      .from('research')
      .select('created_by')
      .eq('id', parentResearchId)
      .single()

    if (fetchParentError) {
      console.log(
        `Fetch parent research failed (id ${parentResearchId}, update ${researchUpdate.id}).`,
        fetchParentError,
      )
      continue
    }

    if (parent.created_by !== profileId) {
      const { error: updateError } = await client
        .from('research_updates')
        .update({ created_by: parent.created_by })
        .eq('id', researchUpdate.id)

      if (updateError) {
        console.log(
          `Update research_update failed (id ${researchUpdate.id}).`,
          updateError,
        )
      }
    }
  }
}

const updateUserContentTypes = async (
  client: SupabaseClient,
  profileId: string,
  username: string,
) => {
  const contentTypes: string[] = ['research', 'library', 'questions', 'news']

  for (const type of contentTypes) {
    const { error: clearError } = await client
      .from(type)
      .update({ created_by: null })
      .eq('created_by', profileId)

    if (clearError) {
      console.log(
        `Clear created_by failed (table ${type}, profile ${profileId}).`,
        clearError,
      )
    }
  }

  const { data: researchCollaboratorData, error: fetchCollaboratorError } =
    await client
      .from('research')
      .select('*')
      .contains('collaborators', [username])

  if (fetchCollaboratorError) {
    console.log(
      `Fetch collaborators failed (username ${username}).`,
      fetchCollaboratorError,
    )
  }

  researchCollaboratorData?.forEach(async (research) => {
    const newCollaborators = research.collaborators.filter(
      (collaborator) => collaborator !== username,
    )

    const { error: clearCollaboratorError } = await client
      .from('research')
      .update({ collaborators: newCollaborators })
      .eq('id', research.id)

    if (clearCollaboratorError) {
      console.log(
        `Clear collaborators failed (username ${username}).`,
        clearCollaboratorError,
      )
    }
  })
}

// TODO - add delete map pin functionality for supabase
const deleteUserContent = async (client: SupabaseClient, profileId: string) => {
  const contentStructure = [
    { contentType: 'subscribers', fieldNames: ['user_id'] },
    { contentType: 'useful_votes', fieldNames: ['user_id'] },
    {
      contentType: 'notifications',
      fieldNames: ['owned_by_id', 'triggered_by_id'],
    },
    { contentType: 'comments', fieldNames: ['created_by'] },
  ]

  contentStructure.forEach(({ contentType, fieldNames }) => {
    fieldNames.forEach(async (fieldName) => {
      const { error } = await client
        .from(contentType)
        .delete()
        .eq(fieldName, profileId)

      if (error) {
        console.log(
          `Delete failed (table=${contentType}, field=${fieldName}, profile=${profileId})`,
          error,
        )
      }
    })
  })
}

const logout = async (client: SupabaseClient, headers: Headers) => {
  const { error } = await client.auth.signOut()

  if (error) {
    return Response.json({ success: false }, { headers })
  }

  return redirect('/')
}

export const userService = {
  createFirebaseProfile,
  deleteProfileData,
  deleteSupabaseUser,
  deleteUserContent,
  getById,
  getProfileForAuthUser,
  getUserCreatedProjects,
  logout,
  updateResearchUpdates,
  updateUserContentTypes,
}
