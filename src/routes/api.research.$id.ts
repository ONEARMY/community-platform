import type { SupabaseClient } from '@supabase/supabase-js';
import { HTTPException } from 'hono/http-exception';
import type { DBResearchItem, FullMedia } from 'oa-shared';
import { ResearchItem, UserRole } from 'oa-shared';
import type { ActionFunctionArgs } from 'react-router';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { contentServiceServer } from 'src/services/contentService.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { researchServiceServer } from 'src/services/researchService.server';
import { subscribersServiceServer } from 'src/services/subscribersService.server';
import { updateUserActivity } from 'src/utils/activity.server';
import { conflictError, forbiddenError, validationError } from 'src/utils/httpException';
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
      isDraft: formData.get('draft') === 'true',
      slug: convertToSlug(formData.get('title') as string),
      image: formData.has('image')
        ? (JSON.parse(formData.get('image') as string) as FullMedia)
        : null,
    };

    const claims = await client.auth.getClaims();

    if (!claims.data?.claims) {
      return Response.json({}, { headers, status: 401 });
    }

    const oldResearch = await researchServiceServer.getById(id, client);

    await validateRequest(request, claims.data.claims.sub, data, oldResearch, client);

    const previousSlugs = contentServiceServer.updatePreviousSlugs(oldResearch, data.slug);

    const researchResult = await client
      .from('research')
      .update({
        title: data.title,
        description: data.description,
        slug: data.slug,
        category: data.category,
        tags: data.tags,
        previous_slugs: previousSlugs,
        is_draft: data.isDraft,
        collaborators: data.collaborators,
        image: data.image,
      })
      .eq('id', id)
      .select()
      .single();

    if (researchResult.error || !researchResult.data) {
      throw researchResult.error;
    }

    const research = ResearchItem.fromDB(researchResult.data, []);

    await subscribersServiceServer.updateResearchSubscribers(
      oldResearch,
      research,
      client,
      headers,
    );

    updateUserActivity(client, claims.data.claims.sub);

    return Response.json({ research }, { headers, status: 201 });
  } catch (error) {
    // If it's an HTTPException, return its response
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    // only log unexpected errors
    console.error(error);

    // For unexpected errors, return a generic error response
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

    const canEdit = await researchServiceServer.isAllowedToEditResearchById(
      client,
      id,
      claims.data.claims.user_metadata?.username,
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
  data: any,
  research: DBResearchItem,
  client: SupabaseClient,
): Promise<void> {
  if (request.method !== 'PUT') {
    throw validationError('Method not allowed');
  }

  if (!data.title) {
    throw validationError('Title is required', 'title');
  }

  if (!data.description) {
    throw validationError('Description is required', 'description');
  }

  if (!data.isDraft && !data.image) {
    throw validationError('Cover image is required', 'image');
  }

  if (
    research.slug !== data.slug &&
    (await contentServiceServer.isDuplicateExistingSlug(data.slug, research.id, client, 'research'))
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

  if (research.created_by !== profile.id && !research.collaborators?.includes(profile.username)) {
    throw forbiddenError();
  }
}
