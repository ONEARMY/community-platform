import { HTTPException } from 'hono/http-exception';
import type { Moderation } from 'oa-shared';
import { UserRole } from 'oa-shared';
import type { ActionFunctionArgs, MiddlewareFunction } from 'react-router';
import { logger } from 'src/logger';
import { requireRoleApi } from 'src/middleware/requireRole.server';
import { sessionMiddleware } from 'src/middleware/session.server';
import { FEEDBACK_REQUIRED, MODERATIONS } from 'src/pages/Admin/Organisations/moderation';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { MapServiceServer } from 'src/services/mapService.server';
import { sendModerationEmail } from 'src/services/moderationEmailService.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { methodNotAllowedError, notFoundError, validationError } from 'src/utils/httpException';

export const middleware: MiddlewareFunction<Response>[] = [
  sessionMiddleware,
  requireRoleApi(UserRole.ADMIN),
];

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    if (request.method !== 'PUT') {
      throw methodNotAllowedError();
    }

    const id = Number(params.id);

    if (!id) {
      throw validationError('A valid id is required', 'id');
    }

    const body = await request.json();
    const moderation = body.moderation as Moderation;

    if (!MODERATIONS.includes(moderation)) {
      throw validationError('Choose a moderation status', 'moderation');
    }

    if (body.feedback != null && typeof body.feedback !== 'string') {
      throw validationError('Feedback must be text', 'feedback');
    }

    const feedback: string | null = body.feedback?.trim() || null;

    if (FEEDBACK_REQUIRED.includes(moderation) && !feedback) {
      throw validationError('Tell the organisation why', 'feedback');
    }

    const profileService = new ProfileServiceServer(client);
    const mapService = new MapServiceServer(client);
    const profile = await profileService.getById(id);
    const isMapPin = !!profile && !profile.moderation;
    const current = isMapPin ? await mapService.getModerationByProfileId(id) : profile;

    if (!profile || !current) {
      throw notFoundError('Organisation');
    }

    await mapService.updateModerationByProfileId(id, moderation, feedback);

    if (!isMapPin) {
      await profileService.updateModeration(id, moderation, feedback);
    }

    const hasChanged =
      current.moderation !== moderation || (current.moderation_feedback || null) !== feedback;

    if (hasChanged && moderation !== 'awaiting-moderation') {
      await sendModerationEmail({
        authId: profile.auth_id,
        client,
        feedback,
        isMapPin,
        moderation,
        requestOrigin: new URL(request.url).origin,
        username: profile.username,
      });
    }

    return Response.json({}, { headers });
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    logger.error('Error moderating organisation:', error);
    return Response.json({ error: 'Error moderating organisation' }, { status: 500, headers });
  }
};
