import { HTTPException } from 'hono/http-exception';
import { UserRole } from 'oa-shared';
import type { ActionFunctionArgs, MiddlewareFunction } from 'react-router';
import { logger } from 'src/logger';
import { requireRoleApi } from 'src/middleware/requireRole.server';
import { sessionMiddleware } from 'src/middleware/session.server';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { methodNotAllowedError, validationError } from 'src/utils/httpException';
import { ProfileTypesServiceServer } from '@/services/profileTypesService.server';

export const middleware: MiddlewareFunction<Response>[] = [
  sessionMiddleware,
  requireRoleApi(UserRole.ADMIN),
];

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);
  const id = Number(params.id);

  try {
    if (request.method !== 'PUT' && request.method !== 'DELETE') {
      throw methodNotAllowedError();
    }

    if (!id) {
      throw validationError('A valid id is required', 'id');
    }

    const profileTypesServiceServer = new ProfileTypesServiceServer(client);

    if (request.method === 'DELETE') {
      await profileTypesServiceServer.delete(id);
      return Response.json({}, { headers, status: 200 });
    }

    const body = await request.json();
    const name = (body.name as string)?.trim();

    if (!name) {
      throw validationError('Name is required', 'name');
    }

    const profileType = await profileTypesServiceServer.update(id, {
      name,
      displayName: body.name as string,
      description: (body.description as string) || null,
      mapPinName: (body.mapPinName as string) || null,
      isSpace: body.isSpace as boolean,
      imageUrl: (body.imageUrl as string) || null,
    });

    return Response.json(profileType, { headers, status: 200 });
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    logger.error('Error updating/deleting profile type:', error);
    return Response.json(
      { error: 'Error updating/deleting profile type' },
      { status: 500, headers },
    );
  }
};
