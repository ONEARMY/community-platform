import type { SupabaseClient, User } from '@supabase/supabase-js';

type CreateProfileArgs = {
  user: User;
  username: string;
};

export class AuthServiceServer {
  constructor(private client: SupabaseClient) {}

  async createUserProfile(args: CreateProfileArgs) {
    // Should add more typing here about the required fields needed to create a profile

    const { data, error } = await this.client
      .from('profile_types')
      .select('*')
      .eq('name', 'member');

    if (error) {
      console.error(error);
      throw 'Default member type not found';
    }

    return await this.client.from('profiles').insert({
      auth_id: args.user.id,
      username: args.username,
      display_name: args.username,
      tenant_id: process.env.TENANT_ID,
      profile_type: data[0].id,
    });
  }

  async isUsernameAvailable(username: string) {
    const result = await this.client.rpc('is_username_available', { username });
    return result.data;
  }
}
