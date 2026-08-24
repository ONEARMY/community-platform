import type { SupabaseClient } from '@supabase/supabase-js';
import { HTTPException } from 'hono/http-exception';
import type { Profile } from 'oa-shared';
import { UserRole } from 'oa-shared';
import type { ActionFunctionArgs } from 'react-router';
import { logger } from 'src/logger';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { membershipNotifications, supporterName } from 'src/services/membership.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { getTenantDisplayName } from 'src/services/tenantSettingsService.server';
import { forbiddenError, validationError } from 'src/utils/httpException';

async function notifySupporterAccountReady(
  client: SupabaseClient,
  profile: Profile,
  request: Request,
) {
  const tenantId = process.env.TENANT_ID;
  const tierBadge = profile.badges?.find((badge) => badge.premiumTier !== undefined);

  if (!tenantId || !tierBadge || !profile.username) {
    return;
  }

  try {
    const siteUrl = new URL(request.url).origin.replace('http:', 'https:');
    const membership = membershipNotifications(
      (await getTenantDisplayName(client, tenantId)) ?? tenantId,
    );

    membership.supporterAccountReady(
      supporterName(null, { id: profile.id, displayName: profile.displayName }),
      tierBadge.displayName,
      `${siteUrl}/u/${profile.username}`,
    );
  } catch (error) {
    logger.error('Supporter account notification failed:', error);
  }
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    const body = await request.json();
    const username = body.username?.trim();

    const claims = await client.auth.getClaims();

    if (!claims.data?.claims) {
      return Response.json({}, { headers, status: 401 });
    }

    const profileService = new ProfileServiceServer(client);
    const profileData = await profileService.getByAuthId(claims.data.claims.sub);

    if (!profileData?.id) {
      throw validationError('Profile not found', 'id');
    }

    const isAdmin = (profileData.roles || []).includes(UserRole.ADMIN);
    if (profileData.username && !isAdmin) {
      throw forbiddenError('Username cannot be changed once set');
    }

    // if username already set and user is not admin, reject (I think this logic will change eventually to let users change)
    if (!username) {
      throw validationError('Username is required', 'username');
    }

    if (/[^a-zA-Z0-9_-]/.test(username)) {
      throw validationError('Username contains invalid characters', 'username');
    }

    const usernameCheck = await client.rpc('is_username_available', {
      username,
      exclude_profile_id: profileData.id,
    });

    if (!usernameCheck.data) {
      throw validationError('Username is already taken', 'username');
    }

    const profile = await profileService.updateUsername(profileData.id, username);

    await notifySupporterAccountReady(client, profile, request);

    return Response.json(profile, { headers, status: 200 });
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    logger.error(error);
    return Response.json({}, { headers, status: 500 });
  }
};
