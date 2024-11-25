import * as functions from 'firebase-functions'

import { DB_ENDPOINTS } from '../models'

import type { firestore } from 'firebase-admin'
import { createSupabaseServerClient } from './supabase-server-client'
import { IUser } from 'oa-shared'

/*********************************************************************
 * Side-effects to be carried out on various question updates, namely:
 * - update the _createdBy user stats with the question id
 *********************************************************************/
export const supabaseProfileCreate = functions
  .runWith({
    memory: '512MB',
    secrets: ['SUPABASE_API_URL', 'SUPABASE_API_KEY', 'TENANT_ID'],
  })
  .firestore.document(`${DB_ENDPOINTS.users}/{id}`)
  .onCreate(async (docSnapshot, _) => {
    await insertOrUpdateProfile(docSnapshot)
  })

export const supabaseProfileUpdate = functions
  .runWith({
    memory: '512MB',
    secrets: ['SUPABASE_API_URL', 'SUPABASE_API_KEY', 'TENANT_ID'],
  })
  .firestore.document(`${DB_ENDPOINTS.users}/{id}`)
  .onUpdate(async (change, _) => {
    const profileBefore = change.before.data() as IUser
    const profileAfter = change.after.data() as IUser

    if (
      profileBefore.displayName !== profileAfter.displayName ||
      profileBefore.userImage?.downloadUrl !==
        profileAfter.userImage?.downloadUrl ||
      profileBefore.verified !== profileAfter.verified ||
      profileBefore.country !== profileAfter.country ||
      arraysAreEqual(
        profileBefore.userRoles || [],
        profileAfter.userRoles || [],
      )
    ) {
      await insertOrUpdateProfile(change.after)
    }
  })

export const supabaseProfileDelete = functions
  .runWith({
    memory: '512MB',
    secrets: ['SUPABASE_API_URL', 'SUPABASE_API_KEY', 'TENANT_ID'],
  })
  .firestore.document(`${DB_ENDPOINTS.users}/{id}`)
  .onDelete(async (docSnapshot, _) => {
    await deleteProfile(docSnapshot)
  })

async function insertOrUpdateProfile(
  docSnapshot: firestore.QueryDocumentSnapshot,
) {
  const { client } = createSupabaseServerClient()
  const user = docSnapshot.data() as IUser

  const { data } = await client
    .from('profiles')
    .select()
    .eq('firebase_auth_id', user._authID)
    .single()

  if (data) {
    // Update
    const { error } = await client
      .from('profiles')
      .update({
        display_name: user.displayName,
        is_verified: user.verified,
        photo_url: user.userImage?.downloadUrl || null,
        country: user.location?.countryCode || null,
        roles: user.userRoles,
      })
      .eq('firebase_auth_id', user._authID)

    if (error) {
      console.log({ ...error })
    }
  } else {
    // Insert
    const { error } = await client
      .from('profiles')
      .insert({
        firebase_auth_id: user._authID,
        display_name: user.displayName,
        is_verified: user.verified,
        photo_url: user.userImage?.downloadUrl || null,
        country: user.location?.countryCode || null,
        tenant_id: process.env.TENANT_ID,
        roles: user.userRoles,
      })
      .eq('firebase_auth_id', user._authID)

    if (error) {
      console.log({ ...error })
    }
  }
}

async function deleteProfile(docSnapshot: firestore.QueryDocumentSnapshot) {
  const { client } = createSupabaseServerClient()

  const user = docSnapshot.data() as IUser

  await client.from('profiles').delete().eq('firebase_auth_id', user._authID)
}

function arraysAreEqual(arr1: string[], arr2: string[]) {
  // Check if lengths are different
  if (arr1.length !== arr2.length) {
    return false
  }
  // Compare each element
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false
    }
  }

  return true
}
