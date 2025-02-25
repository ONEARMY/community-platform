import * as functions from 'firebase-functions'

import { DB_ENDPOINTS } from '../models'
import { createSupabaseServerClient } from './supabase-server-client'

import type { firestore } from 'firebase-admin'
import type { IUser } from 'oa-shared'

/*********************************************************************
 * Side-effects to be carried out on various question updates, namely:
 * - update the _createdBy user stats with the question id
 *********************************************************************/
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

async function insertOrUpdateProfile(
  docSnapshot: firestore.QueryDocumentSnapshot,
) {
  const { client } = createSupabaseServerClient()
  const user = docSnapshot.data() as IUser

  const profileRequest = await client
    .from('profiles')
    .select()
    .eq('username', user.userName)
    .limit(1)

  if (profileRequest.data?.at(0)) {
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
      .eq('username', user.userName)

    if (error) {
      functions.logger.log({ ...error })
    }
  } else {
    // Insert
    const { error } = await client
      .from('profiles')
      .insert({
        display_name: user.displayName,
        is_verified: user.verified,
        photo_url: user.userImage?.downloadUrl || null,
        country: user.location?.countryCode || null,
        tenant_id: process.env.TENANT_ID,
        username: user.userName,
        roles: user.userRoles,
      })
      .eq('username', user.userName)

    if (error) {
      functions.logger.log({ ...error })
    }
  }
}

function arraysAreEqual(arr1: string[], arr2: string[]) {
  // Check if lengths are different
  if (arr1.length !== arr2.length) {
    return false
  }

  // Sort both arrays and compare them
  const sortedArr1 = [...arr1].sort()
  const sortedArr2 = [...arr2].sort()

  for (let i = 0; i < sortedArr1.length; i++) {
    if (sortedArr1[i] !== sortedArr2[i]) {
      return false
    }
  }

  return true
}
