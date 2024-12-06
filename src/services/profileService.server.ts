import { UserRole } from 'oa-shared'
import { createSupabaseServerClient } from 'src/repository/supabase.server'

import type { DBProfile } from 'src/models/profile.model'

async function getProfileByFirebaseAuthId(
  request: Request,
  firebaseAuthId: string,
) {
  const { client } = createSupabaseServerClient(request)

  const { data, error } = await client
    .from('profiles')
    .select()
    .eq('firebase_auth_id', firebaseAuthId)
    .single()

  if (error || !data) {
    return null
  }

  return data as DBProfile
}

function isUserAdmin(user: DBProfile) {
  return (
    user.roles &&
    user.roles.includes(UserRole.ADMIN) &&
    user.roles.includes(UserRole.SUPER_ADMIN)
  )
}

export const profilesService = { getProfileByFirebaseAuthId, isUserAdmin }
