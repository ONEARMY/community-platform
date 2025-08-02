import type { SupabaseClient, User } from '@supabase/supabase-js'

type CreateProfileArgs = {
  user: User
  username: string
}

const createUserProfile = async (
  args: CreateProfileArgs,
  client: SupabaseClient,
) => {
  // Should add more typing here about the required fields needed to create a profile

  return await client.from('profiles').insert({
    auth_id: args.user.id,
    username: args.username,
    display_name: args.username,
    type: 'member',
    tenant_id: process.env.TENANT_ID,
  })
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
}
