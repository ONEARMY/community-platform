import type { SupabaseClient } from '@supabase/supabase-js';
import { EmailContentReach } from 'oa-shared';

const getAll = async (client: SupabaseClient): Promise<EmailContentReach[] | null> => {
  try {
    const response = await client.from('email_content_reach').select('*');
    return response.data?.map((dbReach) =>
      EmailContentReach.fromDB(dbReach),
    ) as EmailContentReach[];
  } catch (error) {
    console.error({ error });
    return null;
  }
};

const getDefault = async (client: SupabaseClient) => {
  const dbAll = await getAll(client);
  const defaultOption = dbAll ? dbAll.find(({ defaultOption }) => defaultOption === true) : null;

  return defaultOption;
};

export const emailContentReachServiceServer = {
  getAll,
  getDefault,
};
