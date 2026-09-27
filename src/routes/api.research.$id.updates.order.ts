import { HTTPException } from 'hono/http-exception';
import type { ActionFunctionArgs, MiddlewareFunction } from 'react-router';
import { sessionContext } from 'src/context';
import { logger } from 'src/logger';
import { sessionMiddleware } from 'src/middleware/session.server';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { ResearchServiceServer } from 'src/services/researchService.server';
import {
  forbiddenError,
  methodNotAllowedError,
  unauthorizedError,
  validationError,
} from 'src/utils/httpException';

export const middleware: MiddlewareFunction<Response>[] = [sessionMiddleware];

export const action = async ({ request, params, context }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    if (request.method !== 'PUT') {
      throw methodNotAllowedError();
    }

    const session = context.get(sessionContext);

    if (!session?.profileId) {
      throw unauthorizedError();
    }

    const researchId = Number(params.id);
    const formData = await request.formData();
    const updateIds = formData.getAll('updateIds').map(Number);

    if (!updateIds.length || updateIds.some((id) => !Number.isInteger(id))) {
      throw validationError('updateIds are required', 'updateIds');
    }

    const researchService = new ResearchServiceServer(client);
    const research = await researchService.getById(researchId);

    if (!research) {
      throw validationError('Research not found', 'research');
    }

    const isAllowed = await researchService.isAllowedToEditResearchById(researchId, {
      id: session.profileId,
      username: session.username,
      roles: session.roles,
    });

    if (!isAllowed) {
      throw forbiddenError('You do not have permission to reorder updates of this research');
    }

    if (!(await researchService.reorderUpdates(researchId, updateIds))) {
      throw validationError('updateIds must match the research updates', 'updateIds');
    }

    return Response.json({}, { headers, status: 200 });
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    logger.error(error);
    return Response.json({}, { headers, status: 500, statusText: 'Error reordering updates' });
  }
};
