import { HTTPException } from 'hono/http-exception';
import type { RemakeDTO } from 'oa-shared';
import type { ActionFunctionArgs } from 'react-router';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { RemakeServiceServer } from 'src/services/remakeService.server';
import { methodNotAllowedError, unauthorizedError, validationError } from 'src/utils/httpException';

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    if (request.method !== 'PUT' && request.method !== 'DELETE') {
      throw methodNotAllowedError();
    }

    const remakeId = Number(params.remakeId);
    const projectId = Number(params.id);

    if (!remakeId) {
      throw validationError('remake id is required', 'remakeId');
    }

    if (!projectId) {
      throw validationError('project id is required', 'id');
    }

    const claims = await client.auth.getClaims();

    if (!claims.data?.claims) {
      throw unauthorizedError();
    }

    const profileService = new ProfileServiceServer(client);
    const profile = await profileService.getByAuthId(claims.data.claims.sub);

    if (!profile) {
      throw validationError('User not found', 'profile');
    }

    const remakeService = new RemakeServiceServer(client);

    if (request.method === 'DELETE') {
      await remakeService.remove(remakeId, projectId, profile);
      profileService.updateUserActivity(claims.data.claims.sub);

      return new Response(null, { headers, status: 204 });
    }

    const body = await request.json();
    const dto: RemakeDTO = {
      images: body.images,
      description: body.description ?? null,
    };

    const remake = await remakeService.update(remakeId, projectId, profile, dto);
    profileService.updateUserActivity(claims.data.claims.sub);

    return Response.json({ remake }, { headers });
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    console.error(error);
    return Response.json({}, { headers, status: 500, statusText: 'Error updating remake' });
  }
};
