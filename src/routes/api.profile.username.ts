import { HTTPException } from 'hono/http-exception';
import type { ActionFunctionArgs } from 'react-router';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { forbiddenError, validationError } from 'src/utils/httpException';

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

    const isAdmin = (profileData.roles || []).includes('admin');
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

    return Response.json(profile, { headers, status: 200 });
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    console.error(error);
    return Response.json({}, { headers, status: 500 });
  }
};
