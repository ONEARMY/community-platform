import type { SupabaseClient, User } from '@supabase/supabase-js'

type CreateProfileArgs = {
  user: User
  username: string
}

type UpdateProfileArgs = {
  supabaseAuthId: string
  firebaseAuthId: string
}

const createUserProfile = async (
  args: CreateProfileArgs,
  client: SupabaseClient,
) => {
  return await client.from('profiles').insert({
    auth_id: args.user.id,
    username: args.username,
    display_name: args.username,
    is_verified: false,
    firebase_auth_id: '',
    tenant_id: process.env.TENANT_ID,
  })
}

const updateUserProfile = async (
  args: UpdateProfileArgs,
  client: SupabaseClient,
) => {
  return await client
    .from('profiles')
    .update({ auth_id: args.supabaseAuthId })
    .eq('firebase_auth_id', args.firebaseAuthId)
}

const getUserByFirebaseId = async (
  firebaseAuthId: string,
  client: SupabaseClient,
) => {
  return await client
    .from('profiles')
    .select('auth_id,username')
    .eq('firebase_auth_id', firebaseAuthId)
}

const isUsernameAvailable = async (
  username: string,
  client: SupabaseClient,
) => {
  const result = await client.rpc('is_username_available', { username })
  return result.data
}

export const authServiceServer = {
  createUserProfile,
  isUsernameAvailable,
  updateUserProfile,
  getUserByFirebaseId,
}
