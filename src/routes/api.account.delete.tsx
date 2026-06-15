import { HTTPException } from 'hono/http-exception';
import type { ActionFunctionArgs } from 'react-router';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { createSupabaseAdminServerClient } from 'src/repository/supabaseAdmin.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { unauthorizedError, validationError } from 'src/utils/httpException';

export const action = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    const formData = await request.formData();
    const password = formData.get('password') as string;

    if (!password) {
      throw validationError('Password is required', 'password');
    }

    const claims = await client.auth.getClaims();
    const authId = claims.data?.claims?.sub;

    if (!authId) {
      throw unauthorizedError();
    }

    // Verify password
    const signInResult = await client.auth.signInWithPassword({
      email: claims.data?.claims?.email as string,
      password,
    });

    if (signInResult.error) {
      throw validationError('Invalid password', 'password');
    }

    const profileService = new ProfileServiceServer(client);
    const profile = await profileService.getByAuthId(authId);

    if (!profile) {
      throw validationError('Profile not found', 'profile');
    }

    const adminClient = createSupabaseAdminServerClient();

    // Check if user has profiles on other tenants
    const { data: allProfiles } = await adminClient
      .from('profiles')
      .select('id, tenant_id')
      .eq('auth_id', authId);

    const hasOtherTenantProfiles = (allProfiles?.length ?? 0) > 1;

    if (hasOtherTenantProfiles) {
      // User has profiles on other tenants, only delete current tenant profile
      // Using regular client (not admin) restricts the operation to current tenant
      const { error } = await client.from('profiles').delete().eq('id', profile.id);

      if (error) {
        throw error;
      }
    } else {
      // User only has profile on this tenant, delete the auth user
      // This will cascade delete the profile
      const { error } = await adminClient.auth.admin.deleteUser(authId);

      if (error) {
        throw error;
      }
    }

    // Sign out the user
    await client.auth.signOut();

    return new Response(null, { headers, status: 204 });
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    console.error(error);
    return Response.json(
      { error: 'Failed to delete account' },
      { headers, status: 500, statusText: 'Failed to delete account' },
    );
  }
};
