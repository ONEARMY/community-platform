import { HTTPException } from 'hono/http-exception';
import type { ActionFunctionArgs } from 'react-router';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { ProfileTypesServiceServer } from 'src/services/profileTypesService.server';
import { forbiddenError, validationError } from 'src/utils/httpException';

export const action = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    const body = await request.json();
    const profileTypeId = Number(body.type);

    const claims = await client.auth.getClaims();

    if (!claims.data?.claims) {
      return Response.json({}, { headers, status: 401 });
    }

    const profileService = new ProfileServiceServer(client);
    const profileData = await profileService.getByAuthId(claims.data.claims.sub);

    if (!profileData?.id) {
      throw validationError('Profile not found', 'id');
    }

    if (!profileTypeId || Number.isNaN(profileTypeId)) {
      throw validationError('A profile type is required', 'type');
    }

    if (!profileData.type?.is_space) {
      throw forbiddenError('Only organisations can change their focus');
    }

    const profileTypes = await new ProfileTypesServiceServer(client).get();
    const targetType = profileTypes.find((type) => type.id === profileTypeId);

    if (!targetType || !targetType.isSpace) {
      throw validationError('Invalid profile type', 'type');
    }

    const profile = await profileService.updateProfileType(profileData.id, profileTypeId);

    return Response.json(profile, { headers, status: 200 });
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    console.error(error);
    return Response.json({}, { headers, status: 500 });
  }
};
