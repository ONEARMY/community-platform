import { HTTPException } from 'hono/http-exception';
import type { ContentType } from 'oa-shared';
import { UserRole } from 'oa-shared';
import type { ActionFunctionArgs, MiddlewareFunction } from 'react-router';
import { logger } from 'src/logger';
import { requireRoleApi } from 'src/middleware/requireRole.server';
import { sessionMiddleware } from 'src/middleware/session.server';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { CategoryServiceServer } from 'src/services/categoryService.server';
import { methodNotAllowedError, validationError } from 'src/utils/httpException';

const CATEGORY_TYPES: ContentType[] = ['questions', 'projects', 'research', 'news'];

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
    const name = (body.name as string)?.trim();
    const type = body.type as ContentType;

    if (!name) {
      throw validationError('Name is required', 'name');
    }

    if (!CATEGORY_TYPES.includes(type)) {
      throw validationError('A valid type is required', 'type');
    }

    const category = await new CategoryServiceServer(client).create({
      name,
      type,
      description: (body.description as string) || null,
      imageUrl: (body.imageUrl as string) || null,
    });

    return Response.json(category, { headers, status: 201 });
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    logger.error('Error creating category:', error);
    return Response.json({ error: 'Error creating category' }, { status: 500, headers });
  }
};
