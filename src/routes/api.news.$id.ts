import type { SupabaseClient } from '@supabase/supabase-js';
import { HTTPException } from 'hono/http-exception';
import type { DBMedia, DBNews, NewsDTO } from 'oa-shared';
import { News } from 'oa-shared';
import type { LoaderFunctionArgs, Params } from 'react-router';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { contentServiceServer } from 'src/services/contentService.server';
import { NewsServiceServer } from 'src/services/newsService.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { updateUserActivity } from 'src/utils/activity.server';
import { getSummaryFromMarkdown } from 'src/utils/getSummaryFromMarkdown';
import { hasAdminRights } from 'src/utils/helpers';
import {
  conflictError,
  forbiddenError,
  methodNotAllowedError,
  notFoundError,
  unauthorizedError,
  validationError,
} from 'src/utils/httpException';
import { convertToSlug } from 'src/utils/slug';

export const action = async ({ request, params }: LoaderFunctionArgs) => {
  const id = Number(params.id);

  if (request.method === 'DELETE') {
    return await deleteNews(request, id);
  }

  const { client, headers } = createSupabaseServerClient(request);

  try {
    const formData = await request.formData();
    const data = {
      body: formData.get('body') as string,
      category: formData.has('category') ? Number(formData.get('category')) : null,
      isDraft: formData.get('isDraft') === 'true',
      profileBadge: formData.has('profileBadge') ? Number(formData.get('profileBadge')) : null,
      tags: formData.has('tags') ? formData.getAll('tags').map((x) => Number(x)) : null,
      title: formData.get('title') as string,
      heroImage: formData.has('heroImage')
        ? (JSON.parse(formData.get('heroImage') as string) as DBMedia)
        : null,
    } satisfies NewsDTO;

    const claims = await client.auth.getClaims();

    if (!claims.data?.claims) {
      throw unauthorizedError();
    }

    const currentNews = await new NewsServiceServer(client).getById(id);
    const slug = convertToSlug(data.title);
    await validateRequest(params, request, claims.data.claims.sub, data, currentNews, slug, client);
    const previousSlugs = contentServiceServer.updatePreviousSlugs(currentNews, slug);

    const isFirstPublish = currentNews.is_draft && !data.isDraft && !currentNews.published_at;

    const now = new Date();

    const newsResult = await client
      .from('news')
      .update({
        body: data.body,
        category: data.category,
        is_draft: data.isDraft,
        modified_at: new Date(),
        slug: slug,
        previous_slugs: previousSlugs,
        profile_badge: data.profileBadge,
        summary: getSummaryFromMarkdown(data.body),
        tags: data.tags,
        title: data.title,
        hero_image: data.heroImage,
        ...(isFirstPublish && { published_at: now }),
      })
      .eq('id', id)
      .select();

    if (newsResult.error || !newsResult.data) {
      throw newsResult.error;
    }

    const news = News.fromDB(newsResult.data[0], []);

    updateUserActivity(client, claims.data.claims.sub);

    return Response.json({ news }, { headers, status: 200 });
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    console.error(error);
    return Response.json({ error: 'Error updating news', status: 500 }, { status: 500 });
  }
};

async function deleteNews(request: Request, id: number) {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    const claims = await client.auth.getClaims();

    if (!claims.data?.claims) {
      throw unauthorizedError();
    }

    const profileService = new ProfileServiceServer(client);
    const profile = await profileService.getByAuthId(claims.data.claims.sub);

    if (!profile) {
      throw validationError('User not found');
    }

    const news = await new NewsServiceServer(client).getById(id);

    if (!news) {
      throw notFoundError('News');
    }

    const isCreator = news.created_by === profile.id;

    if (!isCreator && !hasAdminRights(profile)) {
      throw forbiddenError('Unauthorized');
    }

    await client
      .from('news')
      .update({
        modified_at: new Date(),
        deleted: true,
      })
      .eq('id', id);

    return Response.json({}, { status: 200, headers });
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    console.error('Delete news error:', error);
    return Response.json({}, { status: 500, headers });
  }
}

async function validateRequest(
  params: Params<string>,
  request: Request,
  userAuthId: string,
  data: NewsDTO,
  currentNews: DBNews,
  slug: string,
  client: SupabaseClient,
): Promise<void> {
  if (request.method !== 'PUT') {
    throw methodNotAllowedError();
  }

  if (!params.id) {
    throw validationError('ID is required', 'id');
  }

  if (!data.title) {
    throw validationError('Title is required', 'title');
  }

  if (!data.body) {
    throw validationError('Body is required', 'body');
  }

  if (!data.heroImage) {
    throw validationError('Hero Image is required', 'heroImage');
  }

  if (!currentNews) {
    throw notFoundError('News');
  }

  if (
    currentNews.slug !== slug &&
    (await contentServiceServer.isDuplicateExistingSlug(slug, currentNews.id, client, 'news'))
  ) {
    throw conflictError('This news already exists');
  }

  const profileService = new ProfileServiceServer(client);
  const profile = await profileService.getByAuthId(userAuthId);

  if (!profile) {
    throw validationError('User not found');
  }

  const isCreator = currentNews.created_by === profile.id;

  if (!isCreator && !hasAdminRights(profile)) {
    throw forbiddenError();
  }
}
