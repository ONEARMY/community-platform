import type { SupabaseClient, User } from '@supabase/supabase-js';

type CreateProfileArgs = {
  user: User;
  username: string;
};

const createUserProfile = async (args: CreateProfileArgs, client: SupabaseClient) => {
  // Should add more typing here about the required fields needed to create a profile

  const { data, error } = await client.from('profile_types').select('*').eq('name', 'member');

  if (error) {
    console.error(error);
    throw 'Default member type not found';
  }

  return await client.from('profiles').insert({
    auth_id: args.user.id,
    username: args.username,
    display_name: args.username,
    tenant_id: process.env.TENANT_ID,
    profile_type: data[0].id,
  });
};

const isUsernameAvailable = async (username: string, client: SupabaseClient) => {
  const result = await client.rpc('is_username_available', { username });
  return result.data;
};

const getProfileByAuthId = async (authId: string, client: SupabaseClient) => {
  const { data } = await client
    .from('profiles')
    .select('id,username,roles')
    .eq('auth_id', authId)
    .single();
  return data;
};

export const authServiceServer = {
  createUserProfile,
  isUsernameAvailable,
  getProfileByAuthId,
};
