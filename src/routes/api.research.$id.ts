import type { SupabaseClient } from '@supabase/supabase-js';
import { HTTPException } from 'hono/http-exception';
import type { DBMedia, DBResearchItem, ResearchDTO } from 'oa-shared';
import { ResearchItem, UserRole } from 'oa-shared';
import type { ActionFunctionArgs, MiddlewareFunction } from 'react-router';
import { Session, sessionContext } from 'src/context';
import { logger } from 'src/logger';
import { sessionMiddleware } from 'src/middleware/session.server';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { ContentServiceServer } from 'src/services/contentService.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { ResearchServiceServer } from 'src/services/researchService.server';
import { SubscribersServiceServer } from 'src/services/subscribersService.server';
import {
  conflictError,
  forbiddenError,
  methodNotAllowedError,
  validationError,
} from 'src/utils/httpException';
import { convertToSlug } from 'src/utils/slug';

export const middleware: MiddlewareFunction<Response>[] = [sessionMiddleware];

export const action = async ({ request, params, context }: ActionFunctionArgs) => {
  const id = Number(params.id);
  const session = context.get(sessionContext);

  if (request.method === 'DELETE') {
    return await deleteResearch(request, id, session);
  }

  const { client, headers } = createSupabaseServerClient(request);

  try {
    const formData = await request.formData();
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.has('category') ? Number(formData.get('category')) : null,
      tags: formData.has('tags') ? formData.getAll('tags').map((x) => Number(x)) : null,
      collaborators: formData.has('collaborators')
        ? (formData.getAll('collaborators') as string[])
        : null,
      isDraft: formData.get('isDraft') === 'true',
      coverImage: formData.has('coverImage')
        ? (JSON.parse(formData.get('coverImage') as string) as DBMedia)
        : null,
    } satisfies ResearchDTO;

    const slug = convertToSlug(data.title);

    if (!session) {
      return Response.json({}, { headers, status: 401 });
    }

    const oldResearch = await new ResearchServiceServer(client).getById(id);

    await validateRequest(request, session, data, oldResearch, slug, client);

    const previousSlugs = ContentServiceServer.updatePreviousSlugs(oldResearch, slug);

    const isFirstPublish = oldResearch.is_draft && !data.isDraft && !oldResearch.published_at;

    const researchResult = await client
      .from('research')
      .update({
        title: data.title,
        description: data.description,
        slug,
        category: data.category,
        tags: data.tags,
        previous_slugs: previousSlugs,
        is_draft: data.isDraft,
        collaborators: data.collaborators,
        image: data.coverImage,
        modified_at: new Date(),
        ...(isFirstPublish && { published_at: new Date() }),
      })
      .eq('id', id)
      .select()
      .single();

    if (researchResult.error || !researchResult.data) {
      throw researchResult.error;
    }

    const research = ResearchItem.fromDB(researchResult.data, []);

    await new SubscribersServiceServer(client).updateResearchSubscribers(oldResearch, research);
    new ProfileServiceServer(client).updateUserActivity(session.authId);

    return Response.json({ research }, { headers, status: 201 });
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    logger.error(error);
    return Response.json({ error: 'Error updating research', status: 500 }, { status: 500 });
  }
};

async function deleteResearch(request: Request, id: number, session: Session) {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    if (!session?.profileId) {
      return Response.json({}, { headers, status: 401 });
    }

    const canEdit = await new ResearchServiceServer(client).isAllowedToEditResearchById(id, {
      id: session.profileId,
      username: session.username,
      roles: session.roles,
    });

    if (canEdit) {
      await client
        .from('research')
        .update({
          modified_at: new Date(),
          deleted: true,
        })
        .eq('id', id);

      return Response.json({}, { status: 200, headers });
    }
  } catch (error) {
    logger.error('Delete research error:', error);
  }

  return Response.json({}, { status: 500, headers });
}

async function validateRequest(
  request: Request,
  session: NonNullable<Session>,
  data: ResearchDTO,
  research: DBResearchItem,
  slug: string,
  client: SupabaseClient,
): Promise<void> {
  if (request.method !== 'PUT') {
    throw methodNotAllowedError();
  }

  if (!data.title) {
    throw validationError('Title is required', 'title');
  }

  if (!data.description) {
    throw validationError('Description is required', 'description');
  }

  if (!data.isDraft && !data.coverImage) {
    throw validationError('Cover image is required', 'image');
  }

  if (
    research.slug !== slug &&
    (await new ContentServiceServer(client).isDuplicateExistingSlug(slug, research.id, 'research'))
  ) {
    throw conflictError('This research already exists');
  }

  if (!session.profileId) {
    throw validationError('User not found');
  }

  if (!session.username) {
    throw validationError('You must set a username before editing content', 'username');
  }

  if (session.roles.includes(UserRole.ADMIN)) {
    return;
  }

  if (
    research.created_by !== session.profileId &&
    !(session.username && research.collaborators?.includes(session.username))
  ) {
    throw forbiddenError();
  }
}
