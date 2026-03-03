import type { ActionFunctionArgs } from 'react-router';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { createSupabaseAdminServerClient } from 'src/repository/supabaseAdmin.server';
import { ProfileServiceServer } from 'src/services/profileService.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);
  const formData = await request.formData();

  const password = formData.get('password') as string;

  const claims = await client.auth.getClaims();
  const authId = claims.data?.claims?.sub;

  if (!authId) {
    return Response.json({ error: 'Unauthorized' }, { headers, status: 401 });
  }

  const signInResult = await client.auth.signInWithPassword({
    email: claims.data?.claims?.email as string,
    password,
  });

  if (signInResult.error) {
    return Response.json({ error: 'Invalid password' }, { headers, status: 400 });
  }

  const profileService = new ProfileServiceServer(client);
  const profile = await profileService.getByAuthId(authId);

  if (!profile) {
    return Response.json({ error: 'Profile not found' }, { headers, status: 404 });
  }

  const adminClient = createSupabaseAdminServerClient();

  await adminClient.from('notifications').delete().eq('owned_by_id', profile.id);
  await adminClient.from('notifications').delete().eq('triggered_by_id', profile.id);
  await adminClient.from('notifications_preferences').delete().eq('user_id', profile.id);

  const { error } = await adminClient.auth.admin.deleteUser(authId);

  if (error) {
    return Response.json({ error: 'Failed to delete account' }, { headers, status: 500 });
  }

  await client.auth.signOut();

  return new Response(null, { headers, status: 204 });
};
