import { AuthError, SupabaseClient } from '@supabase/supabase-js';
import { HTTPException } from 'hono/http-exception';
import type { ContentReach, DBMedia, DBNews, DBProfile, Moderation, NewsDTO } from 'oa-shared';
import { News, UserRole } from 'oa-shared';
import { PollDTO } from 'oa-shared/models/poll';
import type { LoaderFunctionArgs, MiddlewareFunction } from 'react-router';
import { logger } from 'src/logger';
import { requireAnyRoleApi } from 'src/middleware/requireRole.server';
import { sessionMiddleware } from 'src/middleware/session.server';
import { ITEMS_PER_PAGE } from 'src/pages/News/constants';
import type { NewsSortOption } from 'src/pages/News/NewsSortOptions';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { BroadcastCoordinationServiceServer } from 'src/services/broadcastCoordinationService.server';
import { NewsServiceServer } from 'src/services/newsService.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { SubscribersServiceServer } from 'src/services/subscribersService.server';
import { extractPlainTextFromTiptapJson } from 'src/utils/extractPlainTextFromTiptapJson';
import { getSummaryFromTiptapJson } from 'src/utils/getSummaryFromTiptapJson';
import { conflictError, methodNotAllowedError, validationError } from 'src/utils/httpException';
import { renderNewsBodyHtml } from 'src/utils/renderNewsBodyHtml';
import { convertToSlug } from 'src/utils/slug';
import { ContentServiceServer } from '../services/contentService.server';
import { PollServiceServer } from '../services/pollService.server';

// GET (feed) stays public; only POST (create) is role-gated.
export const middleware: MiddlewareFunction<Response>[] = [
  sessionMiddleware,
  (args, next) =>
    args.request.method === 'POST'
      ? requireAnyRoleApi([UserRole.ADMIN, UserRole.EDITOR])(args, next)
      : next(),
];

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);
  const q = params.get('q');
  const sort = params.get('sort') as NewsSortOption;
  const skip = Number(params.get('skip')) || 0;

  const { client, headers } = createSupabaseServerClient(request);
  const claims = await client.auth.getClaims();

  let userProfileId: number | null = null;
  let isAdmin = false;

  if (claims?.data?.claims?.sub) {
    const profile = await new ProfileServiceServer(client).getByAuthId(claims.data.claims.sub);
    isAdmin =
      !!profile?.roles?.includes(UserRole.ADMIN) ||
      !!profile?.roles?.includes(UserRole.EDITOR) ||
      !!profile?.roles?.includes(UserRole.MODERATOR);
    userProfileId = profile?.id ?? null;
    await new ProfileServiceServer(client).updateUserActivity(claims.data.claims.sub);
  }

  const rpcResult = await client.rpc('get_news_feed_by_content', {
    p_user_profile_id: userProfileId,
    p_is_admin: isAdmin,
    p_search: q || null,
    p_sort: sort || 'Newest',
    p_skip: skip,
    p_limit: ITEMS_PER_PAGE,
  });

  if (rpcResult.error) {
    logger.error(rpcResult.error);
    return Response.json({ error: 'Failed to load news' }, { status: 500 });
  }
  const rows = rpcResult.data as (DBNews & { total_count: number })[];
  const total = rows[0]?.total_count ?? 0;
  const items = rows.map((row) => News.fromDB(row, [], null, null, renderNewsBodyHtml));

  // Populate useful votes + hero images
  if (items.length > 0) {
    const votes = await client.rpc('get_useful_votes_count_by_content_id', {
      p_content_type: 'news',
      p_content_ids: items.map((x) => x.id),
    });

    const votesByContentId = (votes.data ?? []).reduce((acc, cur) => {
      acc.set(cur.content_id, cur.count);
      return acc;
    }, new Map());

    for (const item of items) {
      item.usefulCount = votesByContentId.get(item.id) ?? 0;
      item.heroImage = await new NewsServiceServer(client).getHeroImage(
        rows.find((x) => x.id === item.id)?.hero_image ?? null,
      );
    }
  }

  return Response.json({ items, total }, { headers });
};

export const action = async ({ request }: LoaderFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    const formData = await request.formData();
    const data = {
      body: formData.has('body') ? JSON.parse(formData.get('body') as string) : null,
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

    const bodyPlainText = extractPlainTextFromTiptapJson(data.body);

    const claims = await client.auth.getClaims();
    const slug = convertToSlug(data.title);
    await validateRequest(request, data, bodyPlainText, slug, claims.error, client);

    const profileRequest = await client
      .from('profiles')
      .select('id,username,roles')
      .eq('auth_id', claims.data!.claims!.sub)
      .limit(1);

    if (profileRequest.error || !profileRequest.data?.at(0)) {
      logger.error({ error: profileRequest.error });
      throw validationError('User not found');
    }

    const profile = profileRequest.data[0] as DBProfile;

    if (!profile.username) {
      throw validationError('You must set a username before creating content', 'username');
    }

    let pollId: number | null = null;

    if (data.poll) {
      const pollService = new PollServiceServer(client);
      try {
        pollId = data.poll.id
          ? await pollService.updatePoll(data.poll)
          : await pollService.createPoll(data.poll);
      } catch (e) {
        logger.error('Error saving or updating the poll: ', data.poll, e);
      }
    }

    const newsResult = await client
      .from('news')
      .insert({
        body: bodyPlainText,
        category: data.category,
        content: data.body,
        content_search_text: bodyPlainText,
        created_by: profile.id,
        is_draft: data.isDraft,
        moderation: 'accepted' as Moderation,
        published_at: data.isDraft ? null : new Date(),
        slug,
        summary: getSummaryFromTiptapJson(data.body),
        tags: data.tags,
        hero_image: data.heroImage,
        title: data.title,
        content_reach: data.contentReach,
        tenant_id: process.env.TENANT_ID,
        poll: pollId,
      })
      .select('*');

    if (newsResult.error || !newsResult.data) {
      throw newsResult.error;
    }

    const newsId = newsResult.data[0].id;

    // Insert badge relations
    if (data.profileBadges && data.profileBadges.length > 0) {
      const badgeRelations = data.profileBadges.map((badgeId) => ({
        news_id: newsId,
        profile_badge_id: badgeId,
        tenant_id: process.env.TENANT_ID,
      }));

      const badgeResult = await client.from('news_badges_relations').insert(badgeRelations);

      if (badgeResult.error) {
        logger.error('Error inserting badge relations:', badgeResult.error);
      }
    }

    const poll = pollId ? await new PollServiceServer(client).getPoll(pollId) : null;

    // Fetch the complete news with badges for response
    const completeNews = await client
      .from('news')
      .select('*, profile_badges:news_badges_relations(profile_badges(*))')
      .eq('id', newsId)
      .single();

    if (completeNews.error || !completeNews.data) {
      throw completeNews.error;
    }

    const news = News.fromDB(completeNews.data, [], null, poll, renderNewsBodyHtml);
    await new SubscribersServiceServer(client).add('news', news.id, profile.id);
    new BroadcastCoordinationServiceServer(client).news(completeNews.data, profile, request);
    await new ProfileServiceServer(client).updateUserActivity(claims.data!.claims!.sub);

    return Response.json({ news }, { headers, status: 201 });
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    logger.error(error);
    return Response.json({ error: 'Error creating news', status: 500 }, { status: 500 });
  }
};

async function validateRequest(
  request: Request,
  data: any,
  bodyPlainText: string,
  slug: string,
  authError: AuthError | null,
  client: SupabaseClient,
) {
  const notDraft = data.isDraft === false;

  if (authError) {
    return {
      status: authError?.status,
      statusText: authError?.message || 'Unknown authentication error',
    };
  }

  if (request.method !== 'POST') {
    throw methodNotAllowedError();
  }

  if (!data.title) {
    throw validationError('Title is required', 'title');
  }

  if (!bodyPlainText.trim() && notDraft) {
    throw validationError('Body is required', 'body');
  }

  if (!data.heroImage && notDraft) {
    throw validationError('Hero image is required', 'heroImage');
  }

  if (await new ContentServiceServer(client).isDuplicateNewSlug(slug, 'news')) {
    throw conflictError('This news already exists');
  }
}
