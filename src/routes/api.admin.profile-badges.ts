import { HTTPException } from 'hono/http-exception';
import { UserRole } from 'oa-shared';
import type { ActionFunctionArgs, MiddlewareFunction } from 'react-router';
import { logger } from 'src/logger';
import { requireRoleApi } from 'src/middleware/requireRole.server';
import { sessionMiddleware } from 'src/middleware/session.server';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { ProfileBadgeServiceServer } from 'src/services/profileBadgeService.server';
import { conflictError, methodNotAllowedError, validationError } from 'src/utils/httpException';
import { getProfileBadgeError, normalizeProfileBadgeInput } from 'src/utils/profileBadges';

export const middleware: MiddlewareFunction<Response>[] = [
  sessionMiddleware,
  requireRoleApi(UserRole.ADMIN),
];

export const action = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    if (request.method !== 'POST') {
      throw methodNotAllowedError();
    }

    const input = normalizeProfileBadgeInput(await request.json());
    const profileBadgeService = new ProfileBadgeServiceServer(client);
    const error = getProfileBadgeError(input, await profileBadgeService.getAllWithUsage());

    if (error) {
      throw error.conflict
        ? conflictError(error.message)
        : validationError(error.message, error.field);
    }

    const profileBadge = await profileBadgeService.create(input);

    return Response.json(profileBadge, { headers, status: 201 });
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    logger.error('Error creating profile badge:', error);
    return Response.json({ error: 'Error creating profile badge' }, { status: 500, headers });
  }
};
