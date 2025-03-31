import type { SupabaseClient } from '@supabase/supabase-js'
import type { DBProfile } from 'oa-shared'

const getByAuthId = async (
  id: string,
  client: SupabaseClient,
): Promise<DBProfile | null> => {
  const { data } = await client
    .from('profiles')
    .select('*')
    .eq('auth_id', id)
    .single()

  if (!data) {
    return null
  }

  return data as DBProfile
}

const getUsersByUsername = async (
  usernames: string[],
  client: SupabaseClient,
): Promise<DBProfile[] | null> => {
  const { data } = await client
    .from('profiles')
    .select('id,username,display_name')
    .in('username', usernames)

  if (!data) {
    return null
  }

  return data as DBProfile[]
}

export const profileServiceServer = {
  getByAuthId,
  getUsersByUsername,
}
