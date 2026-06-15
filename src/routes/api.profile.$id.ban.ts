import { HTTPException } from 'hono/http-exception';
import { UserRole } from 'oa-shared';
import type { ActionFunctionArgs } from 'react-router';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { createSupabaseAdminServerClient } from 'src/repository/supabaseAdmin.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import {
  forbiddenError,
  methodNotAllowedError,
  notFoundError,
  unauthorizedError,
} from 'src/utils/httpException';

export const action = async ({ request, params }: ActionFunctionArgs) => {
  if (request.method !== 'POST') {
    throw methodNotAllowedError();
  }

  const { client, headers } = createSupabaseServerClient(request);

  try {
    const profileId = Number(params.id);

    if (!profileId || isNaN(profileId)) {
      throw notFoundError('Profile');
    }

    const claims = await client.auth.getClaims();

    if (!claims.data?.claims) {
      throw unauthorizedError();
    }

    const profileService = new ProfileServiceServer(client);
    const currentUserProfile = await profileService.getByAuthId(claims.data.claims.sub);

    if (!currentUserProfile) {
      throw unauthorizedError();
    }

    const hasPermission =
      currentUserProfile.roles?.includes(UserRole.ADMIN) ||
      currentUserProfile.roles?.includes(UserRole.MODERATOR);

    if (!hasPermission) {
      throw forbiddenError('Only admins and moderators can ban users');
    }

    const targetProfile = await profileService.getById(profileId);

    if (!targetProfile) {
      throw notFoundError('Profile');
    }

    if (targetProfile.id === currentUserProfile.id) {
      throw forbiddenError('You cannot ban yourself');
    }

    // Prevent banning users with protected roles
    const targetHasProtectedRole =
      targetProfile.roles?.includes(UserRole.ADMIN) ||
      targetProfile.roles?.includes(UserRole.EDITOR) ||
      targetProfile.roles?.includes(UserRole.RESEARCH_CREATOR) ||
      targetProfile.roles?.includes(UserRole.MODERATOR);

    if (targetHasProtectedRole) {
      throw forbiddenError('Users with protected roles cannot be banned');
    }

    const adminClient = createSupabaseAdminServerClient();
    const { error: banError } = await adminClient.auth.admin.updateUserById(
      targetProfile.auth_id,
      { ban_duration: '999999h' }, // Effectively a permanent ban (over 100 years), since Supabase doesn't support true permanent bans
    );

    if (banError) {
      console.error('Error banning auth user:', banError);
      throw new Error('Failed to ban user');
    }

    const now = new Date();

    // Mark all content created by the user as deleted
    await Promise.all([
      client
        .from('questions')
        .update({ deleted: true, modified_at: now })
        .eq('created_by', profileId),
      client
        .from('projects')
        .update({ deleted: true, modified_at: now })
        .eq('created_by', profileId),
      client
        .from('research')
        .update({ deleted: true, modified_at: now })
        .eq('created_by', profileId),
      client
        .from('research_updates')
        .update({ deleted: true, modified_at: now })
        .eq('created_by', profileId),
      client.from('news').update({ deleted: true, modified_at: now }).eq('created_by', profileId),
      client
        .from('comments')
        .update({ deleted: true, modified_at: now })
        .eq('created_by', profileId),
    ]);

    await client.from('profiles').delete().eq('id', profileId);

    return Response.json({ success: true }, { headers, status: 200 });
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    console.error('Ban user error:', error);
    return Response.json({ error: 'Failed to ban user' }, { headers, status: 500 });
  }
};
