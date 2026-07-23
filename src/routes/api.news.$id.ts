import type { SupabaseClient } from '@supabase/supabase-js';
import { HTTPException } from 'hono/http-exception';
import type { ContentReach, DBMedia, DBNews, NewsDTO } from 'oa-shared';
import { getSummaryFromMarkdown, News, UserRole } from 'oa-shared';
import { PollDTO } from 'oa-shared/models/poll';
import type { LoaderFunctionArgs, Params } from 'react-router';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { BroadcastCoordinationServiceServer } from 'src/services/broadcastCoordinationService.server';
import { ContentServiceServer } from 'src/services/contentService.server';
import { NewsServiceServer } from 'src/services/newsService.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import {
  conflictError,
  forbiddenError,
  methodNotAllowedError,
  notFoundError,
  unauthorizedError,
  validationError,
} from 'src/utils/httpException';
import { convertToSlug } from 'src/utils/slug';
import { PollServiceServer } from '../services/pollService.server';

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
      profileBadges: formData.has('profileBadges')
        ? formData.getAll('profileBadges').map((x) => Number(x))
        : [],
      tags: formData.has('tags') ? formData.getAll('tags').map((x) => Number(x)) : null,
      title: formData.get('title') as string,
      heroImage: formData.has('heroImage')
        ? (JSON.parse(formData.get('heroImage') as string) as DBMedia)
        : null,
      contentReach: formData.has('contentReach')
        ? (formData.get('contentReach') as ContentReach)
        : null,
      poll: formData.has('poll') ? (JSON.parse(formData.get('poll') as string) as PollDTO) : null,
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

    const pollService = new PollServiceServer(client);
    const oldPollId = (await new NewsServiceServer(client).getById(id)).poll;

    let newPollId: number | null = null;

    if (data.poll) {
      if (oldPollId && oldPollId == data.poll.id) {
        newPollId = await pollService.updatePoll(data.poll);
      } else {
        newPollId = await pollService.createPoll(data.poll);
      }
    }

    if (oldPollId && oldPollId != newPollId) {
      await pollService.deletePoll(oldPollId);
    }

    const poll = newPollId ? await pollService.getPoll(newPollId) : null;

    const newsResult = await client
      .from('news')
      .update({
        body: data.body,
        category: data.category,
        is_draft: currentNews.published_at ? false : data.isDraft,
        modified_at: new Date(),
        slug: slug,
        previous_slugs: previousSlugs,
        summary: getSummaryFromMarkdown(data.body),
        tags: data.tags,
        title: data.title,
        hero_image: data.heroImage,
        content_reach: data.contentReach,
        poll: newPollId,
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

    const news = News.fromDB(completeNews.data, [], null, poll);
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

    if (
      !isCreator &&
      !profile.roles?.includes(UserRole.ADMIN) &&
      !profile.roles?.includes(UserRole.EDITOR)
    ) {
      throw forbiddenError();
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

  if (
    !isCreator &&
    !profile.roles?.includes(UserRole.ADMIN) &&
    !profile.roles?.includes(UserRole.EDITOR)
  ) {
    throw forbiddenError();
  }
}
