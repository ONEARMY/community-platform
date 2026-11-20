import { HTTPException } from 'hono/http-exception';
import { UserRole } from 'oa-shared';
import type { ActionFunctionArgs, MiddlewareFunction } from 'react-router';
import { logger } from 'src/logger';
import { requireRoleApi } from 'src/middleware/requireRole.server';
import { sessionMiddleware } from 'src/middleware/session.server';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { ProfileBadgeServiceServer } from 'src/services/profileBadgeService.server';
import {
  conflictError,
  methodNotAllowedError,
  notFoundError,
  validationError,
} from 'src/utils/httpException';
import {
  getProfileBadgeDeleteError,
  getProfileBadgeError,
  normalizeProfileBadgeInput,
} from 'src/utils/profileBadges';

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

    const profileBadgeService = new ProfileBadgeServiceServer(client);
    const profileBadges = await profileBadgeService.getAllWithUsage();

    if (!profileBadges.some(({ badge }) => badge.id === id)) {
      throw notFoundError('Badge');
    }

    if (request.method === 'DELETE') {
      const deleteError = getProfileBadgeDeleteError(id, profileBadges);

      if (deleteError) {
        throw conflictError(deleteError);
      }

      await profileBadgeService.delete(id);
      return Response.json({}, { headers, status: 200 });
    }

    const input = normalizeProfileBadgeInput(await request.json());
    const error = getProfileBadgeError(input, profileBadges, id);

    if (error) {
      throw validationError(error.message, error.field);
    }

    const profileBadge = await profileBadgeService.update(id, input);

    return Response.json(profileBadge, { headers, status: 200 });
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    logger.error('Error updating/deleting profile badge:', error);
    return Response.json(
      { error: 'Error updating/deleting profile badge' },
      { status: 500, headers },
    );
  }
};
