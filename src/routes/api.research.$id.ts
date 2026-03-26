import type { SupabaseClient } from '@supabase/supabase-js';
import { HTTPException } from 'hono/http-exception';
import type { DBMedia, DBResearchItem, ResearchDTO } from 'oa-shared';
import { ResearchItem, UserRole } from 'oa-shared';
import type { ActionFunctionArgs } from 'react-router';
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

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const id = Number(params.id);

  if (request.method === 'DELETE') {
    return await deleteResearch(request, id);
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
    const claims = await client.auth.getClaims();

    if (!claims.data?.claims) {
      return Response.json({}, { headers, status: 401 });
    }

    const oldResearch = await new ResearchServiceServer(client).getById(id);

    await validateRequest(request, claims.data.claims.sub, data, oldResearch, slug, client);

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
    new ProfileServiceServer(client).updateUserActivity(claims.data.claims.sub);

    return Response.json({ research }, { headers, status: 201 });
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    console.error(error);
    return Response.json({ error: 'Error updating research', status: 500 }, { status: 500 });
  }
};

async function deleteResearch(request, id: number) {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    const claims = await client.auth.getClaims();

    if (!claims.data?.claims) {
      return Response.json({}, { headers, status: 401 });
    }

    const profile = await new ProfileServiceServer(client).getByAuthId(claims.data.claims.sub);

    if (!profile) {
      return Response.json({}, { headers, status: 401 });
    }

    const canEdit = await new ResearchServiceServer(client).isAllowedToEditResearchById(
      id,
      profile,
    );

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
    console.error('Delete research error:', error);
  }

  return Response.json({}, { status: 500, headers });
}

async function validateRequest(
  request: Request,
  userAuthId: string,
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

  const profile = await new ProfileServiceServer(client).getByAuthId(userAuthId);

  if (!profile) {
    throw validationError('User not found');
  }

  if (profile.roles?.includes(UserRole.ADMIN)) {
    return;
  }

  if (
    research.created_by !== profile.id &&
    !(profile.username && research.collaborators?.includes(profile.username))
  ) {
    throw forbiddenError();
  }
}
