import type { SupabaseClient, User } from '@supabase/supabase-js';
import { logger } from 'src/logger';

type CreateProfileArgs = {
  user: User;
  displayName?: string;
};

// A just-created auth.users row can occasionally not be visible yet to the
// connection PostgREST picks for the following insert (pooler read lag),
// which trips profiles_auth_id_fkey. One short retry clears it.
const FOREIGN_KEY_VIOLATION = '23503';

export class AuthServiceServer {
  constructor(private client: SupabaseClient) {}

  async createUserProfile(args: CreateProfileArgs) {
    // Should add more typing here about the required fields needed to create a profile

    const { data, error } = await this.client
      .from('profile_types')
      .select('*')
      .eq('name', 'member');

    if (error) {
      logger.error(error);
      throw 'Default member type not found';
    }

    const profile = {
      auth_id: args.user.id,
      display_name: args.displayName || '',
      tenant_id: process.env.TENANT_ID,
      profile_type: data[0].id,
    };

    const result = await this.client.from('profiles').insert(profile);

    if (result.error?.code === FOREIGN_KEY_VIOLATION) {
      logger.error(result.error);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return await this.client.from('profiles').insert(profile);
    }

    return result;
  }
}
