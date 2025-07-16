import type { SupabaseClient } from '@supabase/supabase-js'
import type { DBAuthorVotes, DBProfile } from 'oa-shared'

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
    .select(
      'id,username,display_name,is_verified,is_supporter,photo,cover_images,country',
    )
    .in('username', usernames)

  if (!data) {
    return null
  }

  return data as DBProfile[]
}

const getByUsername = async (
  username: string,
  client: SupabaseClient,
): Promise<DBProfile | null> => {
  const { data } = await client
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (!data) {
    return null
  }

  return data as DBProfile
}

const incrementViewCount = async (
  id: number,
  totalViews: number,
  client: SupabaseClient,
) => {
  return await client
    .from('profiles')
    .update({ total_views: (totalViews || 0) + 1 })
    .eq('id', id)
}

const getAuthorUsefulVotes = async (id: number, client: SupabaseClient) => {
  const { data, error } = await client.rpc('get_author_vote_counts', { id })

  if (error || !data) {
    console.error(error)
    return null
  }

  return data as DBAuthorVotes[]
}

export const profileServiceServer = {
  getByAuthId,
  getByUsername,
  getUsersByUsername,
  incrementViewCount,
  getAuthorUsefulVotes,
}
