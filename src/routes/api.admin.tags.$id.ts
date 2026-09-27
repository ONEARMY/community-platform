import { HTTPException } from 'hono/http-exception';
import { UserRole } from 'oa-shared';
import type { ActionFunctionArgs } from 'react-router';
import { logger } from 'src/logger';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { TagsServiceServer } from 'src/services/tagsService.server';
import {
  conflictError,
  forbiddenError,
  methodNotAllowedError,
  unauthorizedError,
  validationError,
} from 'src/utils/httpException';

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);
  const id = Number(params.id);

  try {
    if (request.method !== 'PUT') {
      throw methodNotAllowedError();
    }

    if (!id) {
      throw validationError('A valid id is required', 'id');
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

    if (!name) {
      throw validationError('Name is required', 'name');
    }

    const tagService = new TagsServiceServer(client);

    if (await tagService.isDuplicateName(name, id)) {
      throw conflictError('A tag with this name already exists');
    }

    const tag = await tagService.update(id, { name });

    return Response.json(tag, { headers, status: 200 });
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    logger.error('Error updating tag:', error);
    return Response.json({ error: 'Error updating tag' }, { status: 500, headers });
  }
};
