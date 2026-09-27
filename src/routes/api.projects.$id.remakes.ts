import { HTTPException } from 'hono/http-exception';
import type { RemakeDTO } from 'oa-shared';
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { logger } from 'src/logger';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { RemakeServiceServer } from 'src/services/remakeService.server';
import {
  forbiddenError,
  methodNotAllowedError,
  notFoundError,
  unauthorizedError,
  validationError,
} from 'src/utils/httpException';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    const projectId = Number(params.id);

    if (!projectId) {
      throw validationError('project id is required', 'id');
    }

    const projectResult = await client
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .or('deleted.eq.false,deleted.is.null')
      .single();

    if (projectResult.error || !projectResult.data) {
      throw notFoundError('Project');
    }

    const remakes = await new RemakeServiceServer(client).getByProjectId(projectId);

    return Response.json({ remakes }, { headers });
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    logger.error(error);
    return Response.json({}, { headers, status: 500, statusText: 'Error fetching remakes' });
  }
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    if (request.method !== 'POST') {
      throw methodNotAllowedError();
    }

    const projectId = Number(params.id);

    if (!projectId) {
      throw validationError('project id is required', 'id');
    }

    const claims = await client.auth.getClaims();

    if (!claims.data?.claims) {
      throw unauthorizedError();
    }

    const profileService = new ProfileServiceServer(client);
    const profile = await profileService.getByAuthId(claims.data.claims.sub);

    if (!profile) {
      throw validationError('User not found', 'profile');
    }

    if (!profile.username) {
      throw forbiddenError('You must set a username before adding a remake');
    }

    const projectResult = await client
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .or('deleted.eq.false,deleted.is.null')
      .or('is_draft.eq.false,is_draft.is.null')
      .single();

    if (projectResult.error || !projectResult.data) {
      throw validationError('Project not found', 'project');
    }

    const body = await request.json();
    const dto: RemakeDTO = {
      images: body.images,
      description: body.description ?? null,
    };

    const remake = await new RemakeServiceServer(client).create(projectId, profile, dto);

    profileService.updateUserActivity(claims.data.claims.sub);

    return Response.json({ remake }, { headers, status: 201 });
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    logger.error(error);
    return Response.json({}, { headers, status: 500, statusText: 'Error creating remake' });
  }
};
