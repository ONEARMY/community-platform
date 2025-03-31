import { UserRole } from 'oa-shared'

import type { SupabaseClient } from '@supabase/supabase-js'
import type { ResearchItem } from 'src/models/research.model'

export const isAllowedToEditResearch = async (
  client: SupabaseClient,
  research: ResearchItem,
  currentUsername: string,
) => {
  if (!currentUsername) {
    return false
  }

  if (currentUsername === research.author?.username) {
    return true
  }

  if (
    Array.isArray(research?.collaborators) &&
    research.collaborators.map((x) => x.username).includes(currentUsername)
  ) {
    return true
  }

  const { data } = await client
    .from('profiles')
    .select('roles')
    .eq('username', currentUsername)

  return data?.at(0)?.roles?.includes(UserRole.ADMIN)
}
