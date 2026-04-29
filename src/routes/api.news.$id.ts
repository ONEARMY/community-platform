import type { SupabaseClient } from '@supabase/supabase-js';
import { HTTPException } from 'hono/http-exception';
import type { DBMedia, DBNews, NewsDTO } from 'oa-shared';
import { getSummaryFromMarkdown, News } from 'oa-shared';
import type { LoaderFunctionArgs, Params } from 'react-router';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { BroadcastCoordinationServiceServer } from 'src/services/broadcastCoordinationService.server';
import { ContentServiceServer } from 'src/services/contentService.server';
import { NewsServiceServer } from 'src/services/newsService.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
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
  const { client, headers } = createSupabaseServerClient(request);

  try {
    const id = Number(params.id);
    const formData = await request.formData();
    const data = {
      body: formData.get('body') as string,
      category: formData.has('category') ? Number(formData.get('category')) : null,
      isDraft: formData.get('isDraft') === 'true',
      profileBadges: formData.has('profileBadges')
        ? formData.getAll('profileBadges').map((x) => Number(x))
        : [],
      tags: formData.has('tags') ? formData.getAll('tags').map((x) => Number(x)) : null,
      title: formData.get('title') as string,
      heroImage: formData.has('heroImage')
        ? (JSON.parse(formData.get('heroImage') as string) as DBMedia)
        : null,
      emailContentReach: formData.has('emailContentReach')
        ? Number(formData.get('emailContentReach'))
        : null,
    } satisfies NewsDTO;

    const claims = await client.auth.getClaims();

    if (!claims.data?.claims) {
      throw unauthorizedError();
    }

    const currentNews = await new NewsServiceServer(client).getById(id);
    const slug = convertToSlug(data.title);
    await validateRequest(params, request, claims.data.claims.sub, data, currentNews, slug, client);
    const previousSlugs = ContentServiceServer.updatePreviousSlugs(currentNews, slug);

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
        summary: getSummaryFromMarkdown(data.body),
        tags: data.tags,
        title: data.title,
        hero_image: data.heroImage,
        email_content_reach: data.emailContentReach,
        ...(isFirstPublish && { published_at: now }),
      })
      .eq('id', id)
      .select();

    if (newsResult.error || !newsResult.data) {
      throw newsResult.error;
    }

    // Update badge relations: delete existing and insert new ones
    await client.from('news_badges_relations').delete().eq('news_id', id);

    if (data.profileBadges && data.profileBadges.length > 0) {
      const badgeRelations = data.profileBadges.map((badgeId) => ({
        news_id: id,
        profile_badge_id: badgeId,
        tenant_id: process.env.TENANT_ID,
      }));

      const badgeResult = await client.from('news_badges_relations').insert(badgeRelations);

      if (badgeResult.error) {
        console.error('Error inserting badge relations:', badgeResult.error);
      }
    }

    // Fetch complete news with badges
    const completeNews = await client
      .from('news')
      .select('*, profile_badges:news_badges_relations(profile_badges(*))')
      .eq('id', id)
      .single();

    if (completeNews.error || !completeNews.data) {
      throw completeNews.error;
    }

    const news = News.fromDB(completeNews.data, []);
    const profileService = new ProfileServiceServer(client);
    const profile = await profileService.getByAuthId(claims.data.claims.sub);

    const broadcastCoordinationServiceServer = new BroadcastCoordinationServiceServer(client);
    broadcastCoordinationServiceServer.news(completeNews.data, profile, request, currentNews);

    new ProfileServiceServer(client).updateUserActivity(claims.data.claims.sub);

    return Response.json({ news }, { headers, status: 200 });
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    console.error(error);
    return Response.json({ error: 'Error updating news', status: 500 }, { status: 500 });
  }
};

async function validateRequest(
  params: Params<string>,
  request: Request,
  userAuthId: string,
  data: NewsDTO,
  currentNews: DBNews,
  slug: string,
  client: SupabaseClient,
): Promise<void> {
  const notDraft = data.isDraft === false;

  if (request.method !== 'PUT') {
    throw methodNotAllowedError();
  }

  if (!params.id) {
    throw validationError('ID is required', 'id');
  }

  if (!data.title) {
    throw validationError('Title is required', 'title');
  }

  if (!data.body && notDraft) {
    throw validationError('Body is required to publish', 'body');
  }

  if (!data.heroImage && notDraft) {
    throw validationError('A hero image is required to publish', 'heroImage');
  }

  if (!data.emailContentReach && notDraft) {
    throw validationError('Email content reach is required to publish', 'emailContentReach');
  }

  if (!currentNews) {
    throw notFoundError('News');
  }

  if (
    currentNews.slug !== slug &&
    (await new ContentServiceServer(client).isDuplicateExistingSlug(slug, currentNews.id, 'news'))
  ) {
    throw conflictError('This news already exists');
  }

  const profile = await new ProfileServiceServer(client).getByAuthId(userAuthId);

  if (!profile) {
    throw validationError('User not found');
  }

  if (!profile.username) {
    throw validationError('You must set a username before editing content', 'username');
  }

  const isCreator = currentNews.created_by === profile.id;

  if (!isCreator && !hasAdminRights(profile)) {
    throw forbiddenError();
  }
}
