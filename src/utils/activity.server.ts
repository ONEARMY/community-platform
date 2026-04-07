import type { PostgrestSingleResponse, SupabaseClient } from '@supabase/supabase-js';

export const updateUserActivity = async (
  client: SupabaseClient,
  userId: string,
): Promise<PostgrestSingleResponse<null>> => {
  return await client
    .from('profiles')
    .update({ last_active: new Date().toISOString() })
    .eq('auth_id', userId);
};
