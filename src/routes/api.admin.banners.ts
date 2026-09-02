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

export const action = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    if (request.method !== 'POST') {
      throw methodNotAllowedError();
    }

    const body = await request.json();
    const text = (body.text as string)?.trim();

    if (!text) {
      throw validationError('Text is required', 'text');
    }

    const banner = await new BannerServiceServer(client).create({
      text,
      url: (body.url as string)?.trim() || null,
    });

    return Response.json(banner, { headers, status: 201 });
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    logger.error('Error creating banner:', error);
    return Response.json({ error: 'Error creating banner' }, { status: 500, headers });
  }
};
