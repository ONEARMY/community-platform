// TODO: split this in separate files once we update remix to NOT use file-based routing

import { HTTPException } from 'hono/http-exception';
import type { DBMedia, DBNews, DBProfile, Moderation, NewsDTO } from 'oa-shared';
import { News } from 'oa-shared';
import type { LoaderFunctionArgs } from 'react-router';
import { ITEMS_PER_PAGE } from 'src/pages/News/constants';
import type { NewsSortOption } from 'src/pages/News/NewsSortOptions';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { discordServiceServer } from 'src/services/discordService.server';
import { NewsServiceServer } from 'src/services/newsService.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { SubscribersServiceServer } from 'src/services/subscribersService.server';
import { getSummaryFromMarkdown } from 'src/utils/getSummaryFromMarkdown';
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
  let currentUserBadges: number[] = [];
  let isAdmin = false;
  if (claims?.data?.claims?.sub) {
    const profile = await new ProfileServiceServer(client).getByAuthId(claims.data.claims.sub);
    isAdmin = !!profile?.roles?.includes('admin');
    currentUserBadges = profile?.badges?.map((x) => x.profile_badges.id) || [];
  }

  let query = client
    .from('news')
    .select(
      `
      id,
      created_at,
      created_by,
      modified_at,
      published_at,
      is_draft,
      comment_count,
      body,
      slug,
      summary,
      category:category(id,name),
      profile_badge:profile_badge(*),
      tags,
      title,
      total_views,
      hero_image,
      author:profiles(id, display_name, username, country, badges:profile_badges_relations(
        profile_badges(
          id,
          name,
          display_name,
          image_url,
          action_url
        )
      ))`,
      { count: 'exact' },
    )

    .eq('is_draft', false);

  if (!isAdmin) {
    query = query.or(
      `profile_badge.is.null${currentUserBadges.length > 0 ? `,profile_badge.in.(${currentUserBadges.join(',')})` : ''}`,
    );
  }

  if (q) {
    query = query.textSearch('news_search_fields', q);
  }

  if (sort === 'Newest') {
    query = query.order('published_at', { ascending: false });
  } else if (sort === 'Comments') {
    query = query.order('comment_count', { ascending: false });
  } else if (sort === 'LeastComments') {
    query = query.order('comment_count', { ascending: true });
  }

  const queryResult = await query.range(skip, skip + ITEMS_PER_PAGE - 1); // 0 based

  const total = queryResult.count;
  const data = queryResult.data as unknown as DBNews[];
  const items = data.map((dbNews) => News.fromDB(dbNews, []));

  if (items && items.length > 0) {
    // Populate useful votes
    const votes = await client.rpc('get_useful_votes_count_by_content_id', {
      p_content_type: 'news',
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
        item.heroImage = await new NewsServiceServer(client).getHeroImage(
          data.find((x) => x.id === item.id)?.hero_image || null,
        );
      }
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
      profileBadge: formData.has('profileBadge') ? Number(formData.get('profileBadge')) : null,
      tags: formData.has('tags') ? formData.getAll('tags').map((x) => Number(x)) : null,
      title: formData.get('title') as string,
      heroImage: formData.has('heroImage')
        ? (JSON.parse(formData.get('heroImage') as string) as DBMedia)
        : null,
    } satisfies NewsDTO;

    const claims = await client.auth.getClaims();

    if (!claims.data?.claims) {
      return Response.json({}, { headers, status: 401 });
    }

    await validateRequest(request, data);

    const slug = convertToSlug(data.title);

    if (await new ContentServiceServer(client).isDuplicateNewSlug(slug, 'news')) {
      throw conflictError('This news already exists');
    }

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

    const newsResult = await client
      .from('news')
      .insert({
        body: data.body,
        category: data.category,
        created_by: profile.id,
        is_draft: data.isDraft,
        moderation: 'accepted' as Moderation,
        profile_badge: data.profileBadge,
        published_at: data.isDraft ? null : new Date(),
        slug,
        summary: getSummaryFromMarkdown(data.body),
        tags: data.tags,
        hero_image: data.heroImage,
        tenant_id: process.env.TENANT_ID,
        title: data.title,
      })
      .select();

    if (newsResult.error || !newsResult.data) {
      throw newsResult.error;
    }

    const news = News.fromDB(newsResult.data[0], []);
    new SubscribersServiceServer(client).add('news', news.id, profile.id);

    if (!news.isDraft) {
      notifyDiscord(news, profile, new URL(request.url).origin.replace('http:', 'https:'));
    }

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

function notifyDiscord(news: News, profile: DBProfile, siteUrl: string) {
  const title = news.title;
  const slug = news.slug;

  discordServiceServer.postWebhookRequest(
    `📰 ${profile.username} has news: ${title}\n<${siteUrl}/news/${slug}>`,
  );
}

async function validateRequest(request: Request, data: NewsDTO): Promise<void> {
  if (request.method !== 'POST') {
    throw methodNotAllowedError();
  }

  if (!data.title) {
    throw validationError('Title is required', 'title');
  }

  if (!data.body) {
    throw validationError('Body is required', 'body');
  }

  if (!data.heroImage) {
    throw validationError('Hero image is required', 'body');
  }
}
