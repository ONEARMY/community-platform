import { ResearchItem, UserRole } from 'oa-shared';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { contentServiceServer } from 'src/services/contentService.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { researchServiceServer } from 'src/services/researchService.server';
import { storageServiceServer } from 'src/services/storageService.server';
import { subscribersServiceServer } from 'src/services/subscribersService.server';
import { updateUserActivity } from 'src/utils/activity.server';
import { convertToSlug } from 'src/utils/slug';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { DBResearchItem } from 'oa-shared';
import type { ActionFunctionArgs } from 'react-router';

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
      uploadedImage: formData.get('image') as File | null,
      existingImage: formData.get('existingImage') as string | null,
    };

    const claims = await client.auth.getClaims();

    if (!claims.data?.claims) {
      return Response.json({}, { headers, status: 401 });
    }

    const oldResearch = await researchServiceServer.getById(id, client);

    const { valid, status, statusText } = await validateRequest(
      request,
      claims.data.claims.sub,
      data,
      oldResearch,
      client,
    );

    if (!valid) {
      return Response.json({}, { headers, status, statusText });
    }

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
        ...(!data.existingImage && { image: null }),
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

    if (data.uploadedImage) {
      // TODO:remove unused images from storage
      const mediaResult = await storageServiceServer.uploadImage(
        [data.uploadedImage],
        `research/${research.id}`,
        client,
      );

      if (mediaResult?.errors?.length) {
        console.error(mediaResult.errors);
      }

      if (mediaResult?.media && mediaResult.media.length > 0) {
        const result = await client
          .from('research')
          .update({ image: mediaResult.media[0] })
          .eq('id', research.id)
          .select('image');

        if (result.data && result.data.length > 0) {
          const [image] = storageServiceServer.getPublicUrls(
            client,
            result.data?.at(0)?.image ? [result.data[0].image] : [],
          );

          research.image = image;
        }
      }
    }

    updateUserActivity(client, claims.data.claims.sub);

    return Response.json({ research }, { headers, status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({}, { headers, status: 500, statusText: 'Error creating research' });
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
      claims.data.claims.user_metadata.username,
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
) {
  if (request.method !== 'PUT') {
    return { status: 405, statusText: 'method not allowed' };
  }

  if (!data.title) {
    return { status: 400, statusText: 'title is required' };
  }

  if (!data.description) {
    return { status: 400, statusText: 'description is required' };
  }

  if (!data.isDraft && !data.uploadedImage && !data.existingImage) {
    return { status: 400, statusText: 'image is required' };
  }

  if (
    research.slug !== data.slug &&
    (await contentServiceServer.isDuplicateExistingSlug(data.slug, research.id, client, 'research'))
  ) {
    return {
      status: 409,
      statusText: 'This research already exists',
    };
  }

  const profile = await new ProfileServiceServer(client).getByAuthId(userAuthId);

  if (!profile) {
    return { status: 400, statusText: 'User not found' };
  }

  if (profile.roles?.includes(UserRole.ADMIN)) {
    return { valid: true };
  }

  if (research.created_by !== profile.id && !research.collaborators?.includes(profile.username)) {
    return { status: 403, statusText: 'forbidden' };
  }

  return { valid: true };
}
