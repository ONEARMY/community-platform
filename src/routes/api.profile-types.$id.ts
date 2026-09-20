import { HTTPException } from 'hono/http-exception';
import { UserRole } from 'oa-shared';
import type { LoaderFunctionArgs } from 'react-router';
import { logger } from 'src/logger';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import {
  forbiddenError,
  notFoundError,
  unauthorizedError,
  validationError,
} from 'src/utils/httpException';
import { ProfileTypesServiceServer } from '@/services/profileTypesService.server';

export const action = async ({ request, params }: LoaderFunctionArgs) => {
  const id = Number(params.id);

  if (request.method === 'DELETE') {
    return await deleteProfileType(request, id);
  }
};

async function deleteProfileType(request: Request, id: number) {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    const claims = await client.auth.getClaims();

    if (!claims.data?.claims) {
      throw unauthorizedError();
    }

    const profileService = new ProfileServiceServer(client);
    const profile = await profileService.getByAuthId(claims.data.claims.sub);

    if (!profile) {
      throw validationError('User not found');
    }

    const profileType = await new ProfileTypesServiceServer(client).getById(id);

    if (!profileType) {
      throw notFoundError('ProfileType');
    }

    if (!profile.roles?.includes(UserRole.ADMIN)) {
      throw forbiddenError();
    }

    await client.from('profile-types').delete().eq('id', id);

    return Response.json({}, { status: 200, headers });
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    logger.error('Delete profile type error:', error);
    return Response.json({}, { status: 500, headers });
  }
}
