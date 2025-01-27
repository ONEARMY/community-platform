import type { SupabaseClient, User } from '@supabase/supabase-js'

type CreateProfileArgs = {
  user: User
  username: string
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

const isUsernameAvailable = async (
  username: string,
  client: SupabaseClient,
) => {
  const result = await client
    .from('profiles')
    .select('id')
    .eq('username', username)
    .limit(1)

  return !result.data?.at(0)
}

const fixUsername = async (id: string, client: SupabaseClient) => {
  const result = await client
    .from('profiles')
    .select('username')
    .eq('auth_id', id)
    .limit(1)

  const username = result.data?.at(0)?.username

  if (username) {
    await client.auth.updateUser({ data: { username } })
  }
}

export const authServiceServer = {
  createUserProfile,
  isUsernameAvailable,
  fixUsername,
}
