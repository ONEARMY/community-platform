import type { SupabaseClient } from '@supabase/supabase-js';

export const updateUserActivity = async (client: SupabaseClient, userId: string) => {
  return await client
    .from('profiles')
    .update({ last_active: new Date().toISOString() })
    .eq('auth_id', userId);
};
