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

    const categoryServiceServer = new CategoryServiceServer(client);

    if (request.method === 'DELETE') {
      await categoryServiceServer.delete(id);
      return Response.json({}, { headers, status: 200 });
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

    const category = await categoryServiceServer.update(id, {
      name,
      type,
      description: (body.description as string) || null,
      imageUrl: (body.imageUrl as string) || null,
    });

    return Response.json(category, { headers, status: 200 });
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    logger.error('Error updating/deleting category:', error);
    return Response.json({ error: 'Error updating/deleting category' }, { status: 500, headers });
  }
};
