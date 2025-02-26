import type { SupabaseClient } from '@supabase/supabase-js'
import type { DBProfile } from 'src/models/profile.model'

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

export const profileServiceServer = {
  getByAuthId,
}
