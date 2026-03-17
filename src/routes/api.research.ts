import { HTTPException } from 'hono/http-exception';
import type { DBMedia, DBResearchItem, ResearchDTO, ResearchStatus } from 'oa-shared';
import { ResearchItem } from 'oa-shared';
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { IMAGE_SIZES } from 'src/config/imageTransforms';
import { ITEMS_PER_PAGE } from 'src/pages/Research/constants';
import type { ResearchSortOption } from 'src/pages/Research/ResearchSortOptions.ts';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { contentServiceServer } from 'src/services/contentService.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { StorageServiceServer } from 'src/services/storageService.server';
import { subscribersServiceServer } from 'src/services/subscribersService.server';
import { updateUserActivity } from 'src/utils/activity.server';
import { conflictError, methodNotAllowedError, validationError } from 'src/utils/httpException';
import { convertToSlug } from 'src/utils/slug';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const q = searchParams.get('q');
  const category = Number(searchParams.get('category')) || undefined;
  const sort = searchParams.get('sort') as ResearchSortOption;
  const skip = Number(searchParams.get('skip')) || 0;
  const status: ResearchStatus | null = searchParams.get('status') as ResearchStatus;

  const { client, headers } = createSupabaseServerClient(request);

  const { data, error } = await client.rpc('get_research', {
    search_query: q || null,
    category_id: category,
    research_status: status || null,
    sort_by: sort,
    offset_val: skip,
    limit_val: ITEMS_PER_PAGE,
  });

  const countResult = await client.rpc('get_research_count', {
    search_query: q || null,
    category_id: category,
    research_status: status || null,
  });
  const count = countResult.data || 0;

  if (error) {
    console.error(error);
    return Response.json({}, { status: 500, headers });
  }

  const dbItems = data as DBResearchItem[];

  if (!dbItems || dbItems.length === 0) {
    return Response.json({ items: [], total: 0 }, { headers });
  }

  const items = dbItems.map((dbResearchItem) => {
    const images = dbResearchItem.image
      ? new StorageServiceServer(client).getPublicUrls([dbResearchItem.image], IMAGE_SIZES.LIST)
      : [];
    return ResearchItem.fromDB(dbResearchItem, [], images);
  });

  if (items && items.length > 0) {
    // Populate useful votes
    const votes = await client.rpc('get_useful_votes_count_by_content_id', {
      p_content_type: 'research',
      p_content_ids: items.map((x) => x.id),
    });

    if (votes.data) {
      const votesByContentId = votes.data.reduce((acc, current) => {
        acc.set(current.content_id, current.count);
        return acc;
      }, new Map());

      for (const item of items) {
        if (votesByContentId.has(item.id)) {
          item.usefulCount = votesByContentId.get(item.id)!;
        }
      }
    }
  }

  return Response.json({ items, total: count }, { headers });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    const formData = await request.formData();
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      isDraft: formData.get('isDraft') === 'true',
      category: formData.has('category') ? Number(formData.get('category')) : null,
      tags: formData.has('tags') ? formData.getAll('tags').map((x) => Number(x)) : null,
      collaborators: formData.has('collaborators')
        ? (formData.getAll('collaborators') as string[])
        : null,
      coverImage: formData.has('coverImage')
        ? (JSON.parse(formData.get('coverImage') as string) as DBMedia)
        : null,
    } satisfies ResearchDTO;

    const claims = await client.auth.getClaims();

    if (!claims.data?.claims) {
      return Response.json({}, { headers, status: 401 });
    }

    validateRequest(request, data);

    const slug = convertToSlug(data.title);

    if (await contentServiceServer.isDuplicateNewSlug(slug, client, 'research')) {
      throw conflictError('This research already exists');
    }

    const profileService = new ProfileServiceServer(client);
    const profile = await profileService.getByAuthId(claims.data.claims.sub);

    if (!profile) {
      throw validationError('User not found');
    }

    const researchStatus: ResearchStatus = 'in-progress';
    const researchResult = await client
      .from('research')
      .insert({
        created_by: profile.id,
        title: data.title,
        description: data.description,
        slug,
        category: data.category,
        tags: data.tags,
        collaborators: data.collaborators,
        status: researchStatus,
        is_draft: data.isDraft,
        image: data.coverImage,
        published_at: data.isDraft ? null : new Date(),
        tenant_id: process.env.TENANT_ID,
      })
      .select()
      .single();

    if (researchResult.error || !researchResult.data) {
      throw researchResult.error;
    }

    const research = ResearchItem.fromDB(
      researchResult.data,
      [],
      [],
      researchResult.data.collaborators,
    );

    await subscribersServiceServer.addResearchSubscribers(research, profile.id, client, headers);

    updateUserActivity(client, claims.data.claims.sub);

    return Response.json({ research }, { headers, status: 201 });
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    console.error(error);
    return Response.json({ error: 'Error creating research', status: 500 }, { status: 500 });
  }
};

function validateRequest(request: Request, data: ResearchDTO) {
  if (request.method !== 'POST') {
    throw methodNotAllowedError();
  }

  if (!data.title) {
    throw validationError('Title is required', 'title');
  }

  if (!data.description) {
    throw validationError('Description is required', 'description');
  }

  if (!data.isDraft && !data.coverImage) {
    throw validationError('Cover Image is required', 'coverImage');
  }
}
