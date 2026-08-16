import { HTTPException } from 'hono/http-exception';
import type { ContentType } from 'oa-shared';
import { UserRole } from 'oa-shared';
import type { ActionFunctionArgs } from 'react-router';
import { logger } from 'src/logger';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { CategoryServiceServer } from 'src/services/categoryService.server';
import {
  forbiddenError,
  methodNotAllowedError,
  unauthorizedError,
  validationError,
} from 'src/utils/httpException';

const CATEGORY_TYPES: ContentType[] = ['questions', 'projects', 'research', 'news'];

export const action = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    if (request.method !== 'POST') {
      throw methodNotAllowedError();
    }

    const claims = await client.auth.getClaims();

    if (!claims.data?.claims) {
      throw unauthorizedError();
    }

    const { data: profiles } = await client
      .from('profiles')
      .select('id,roles')
      .eq('auth_id', claims.data.claims.sub)
      .limit(1);

    if (!profiles?.at(0)?.roles?.includes(UserRole.ADMIN)) {
      throw forbiddenError();
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
