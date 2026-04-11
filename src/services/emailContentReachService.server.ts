import type { SupabaseClient } from '@supabase/supabase-js';
import { DBEmailContentReach } from 'oa-shared';

const getAll = async (client: SupabaseClient): Promise<DBEmailContentReach[] | null> => {
  try {
    const response = await client.from('email_content_reach').select('*');
    return response.data as DBEmailContentReach[];
  } catch (error) {
    console.error({ error });
    return null;
  }
};

const getDefault = async (client: SupabaseClient) => {
  const dbAll = await getAll(client);
  const defaultOption = dbAll ? dbAll.find(({ default_option }) => default_option === true) : null;

  return defaultOption;
};

export const emailContentReachServiceServer = {
  getAll,
  getDefault,
};
