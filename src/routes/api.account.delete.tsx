import type { ActionFunctionArgs } from 'react-router';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { createSupabaseAdminServerClient } from 'src/repository/supabaseAdmin.server';
import { ProfileServiceServer } from 'src/services/profileService.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    const formData = await request.formData();
    const password = formData.get('password') as string;

    if (!password) {
      return Response.json({}, { headers, status: 400, statusText: 'Password is required' });
    }

    const claims = await client.auth.getClaims();
    const authId = claims.data?.claims?.sub;

    if (!authId) {
      return Response.json({}, { headers, status: 401 });
    }

    const signInResult = await client.auth.signInWithPassword({
      email: claims.data?.claims?.email as string,
      password,
    });

    if (signInResult.error) {
      return Response.json({}, { headers, status: 400, statusText: 'Invalid password' });
    }

    const profileService = new ProfileServiceServer(client);
    const profile = await profileService.getByAuthId(authId);

    if (!profile) {
      return Response.json({}, { headers, status: 400, statusText: 'Profile not found' });
    }

    const adminClient = createSupabaseAdminServerClient();

    const { data: allProfiles } = await adminClient
      .from('profiles')
      .select('id, tenant_id')
      .eq('auth_id', authId);

    const hasOtherTenantProfiles = (allProfiles?.length ?? 0) > 1;

    if (hasOtherTenantProfiles) {
      const { error } = await client.from('profiles').delete().eq('id', profile.id);

      if (error) {
        throw error;
      }
    } else {
      const { error } = await adminClient.auth.admin.deleteUser(authId);

      if (error) {
        throw error;
      }
    }

    await client.auth.signOut();

    return new Response(null, { headers, status: 204 });
  } catch (error) {
    console.error(error);
    return Response.json({}, { headers, status: 500, statusText: 'Failed to delete account' });
  }
};
