import { HTTPException } from 'hono/http-exception';
import { UserRole } from 'oa-shared';
import type { ActionFunctionArgs, MiddlewareFunction } from 'react-router';
import { logger } from 'src/logger';
import { requireRoleApi } from 'src/middleware/requireRole.server';
import { sessionMiddleware } from 'src/middleware/session.server';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { BannerServiceServer } from 'src/services/bannerService.server';
import { methodNotAllowedError, validationError } from 'src/utils/httpException';

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

    const bannerServiceServer = new BannerServiceServer(client);

    if (request.method === 'DELETE') {
      await bannerServiceServer.delete(id);
      return Response.json({}, { headers, status: 200 });
    }

    const body = await request.json();
    const text = (body.text as string)?.trim();

    if (!text) {
      throw validationError('Text is required', 'text');
    }

    const banner = await bannerServiceServer.update(id, {
      text,
      url: (body.url as string)?.trim() || null,
    });

    return Response.json(banner, { headers, status: 200 });
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    logger.error('Error updating/deleting banner:', error);
    return Response.json({ error: 'Error updating/deleting banner' }, { status: 500, headers });
  }
};
