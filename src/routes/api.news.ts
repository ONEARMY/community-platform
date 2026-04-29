import { AuthError, SupabaseClient } from '@supabase/supabase-js';
import { HTTPException } from 'hono/http-exception';
import type { DBMedia, DBNews, DBProfile, Moderation, NewsDTO } from 'oa-shared';
import { getSummaryFromMarkdown, News } from 'oa-shared';
import type { LoaderFunctionArgs } from 'react-router';
import { ITEMS_PER_PAGE } from 'src/pages/News/constants';
import type { NewsSortOption } from 'src/pages/News/NewsSortOptions';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { BroadcastCoordinationServiceServer } from 'src/services/broadcastCoordinationService.server';
import { NewsServiceServer } from 'src/services/newsService.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { SubscribersServiceServer } from 'src/services/subscribersService.server';
import { conflictError, methodNotAllowedError, validationError } from 'src/utils/httpException';
import { convertToSlug } from 'src/utils/slug';
import { ContentServiceServer } from '../services/contentService.server';

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
    isAdmin = !!profile?.roles?.includes('admin');
    userProfileId = profile?.id ?? null;
    await new ProfileServiceServer(client).updateUserActivity(claims.data.claims.sub);
  }

  const rpcResult = await client.rpc('get_news_feed', {
    p_user_profile_id: userProfileId,
    p_is_admin: isAdmin,
    p_search: q || null,
    p_sort: sort || 'Newest',
    p_skip: skip,
    p_limit: ITEMS_PER_PAGE,
  });

  if (rpcResult.error) {
    console.error(rpcResult.error);
    return Response.json({ error: 'Failed to load news' }, { status: 500 });
  }
  const rows = rpcResult.data as (DBNews & { total_count: number })[];
  const total = rows[0]?.total_count ?? 0;
  // No badge fetch needed anymore
  const items = rows.map((row) => News.fromDB(row, []));

  // Populate useful votes + hero images (unchanged)
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
      return Response.json({}, { headers, status: 401 });
    }
    const slug = convertToSlug(data.title);
    await validateRequest(request, data, slug, claims.error, client);

    const profileRequest = await client
      .from('profiles')
      .select('id,username')
      .eq('auth_id', claims.data.claims.sub)
      .limit(1);

    if (profileRequest.error || !profileRequest.data?.at(0)) {
      console.error(profileRequest.error);
      throw validationError('User not found');
    }

    const profile = profileRequest.data[0] as DBProfile;

    if (!profile.username) {
      throw validationError('You must set a username before creating content', 'username');
    }

    const newsResult = await client
      .from('news')
      .insert({
        body: data.body,
        category: data.category,
        created_by: profile.id,
        is_draft: data.isDraft,
        moderation: 'accepted' as Moderation,
        published_at: data.isDraft ? null : new Date(),
        slug,
        summary: getSummaryFromMarkdown(data.body),
        tags: data.tags,
        hero_image: data.heroImage,
        tenant_id: process.env.TENANT_ID,
        title: data.title,
        email_content_reach: data.emailContentReach,
      })
      .select('*, email_content_reach:email_content_reach(*)');

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
        console.error('Error inserting badge relations:', badgeResult.error);
      }
    }

    // Fetch the complete news with badges for response
    const completeNews = await client
      .from('news')
      .select(
        '*, profile_badges:news_badges_relations(profile_badges(*)), email_content_reach:email_content_reach(*)',
      )
      .eq('id', newsId)
      .single();

    if (completeNews.error || !completeNews.data) {
      throw completeNews.error;
    }

    const news = News.fromDB(completeNews.data, []);
    new SubscribersServiceServer(client).add('news', news.id, profile.id);
    new BroadcastCoordinationServiceServer(client).news(completeNews.data, profile, request);
    await new ProfileServiceServer(client).updateUserActivity(claims.data.claims.sub);

    return Response.json({ news }, { headers, status: 201 });
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    console.error(error);
    return Response.json({ error: 'Error creating news', status: 500 }, { status: 500 });
  }
};

async function validateRequest(
  request: Request,
  data: any,
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

  if (!data.body && notDraft) {
    throw validationError('Body is required', 'body');
  }

  if (!data.heroImage && notDraft) {
    throw validationError('Hero image is required', 'heroImage');
  }

  if (!data.emailContentReach && notDraft) {
    throw validationError('Email content reach is required to publish', 'emailContentReach');
  }

  if (await new ContentServiceServer(client).isDuplicateNewSlug(slug, 'news')) {
    throw conflictError('This news already exists');
  }
}
