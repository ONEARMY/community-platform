import { SupabaseClient } from '@supabase/supabase-js';
import type { DBNews, TenantSettings } from 'oa-shared';
import { News, UserRole } from 'oa-shared';
import { PollDTO } from 'oa-shared/models/poll';
import type { LoaderFunctionArgs } from 'react-router';
import { data, redirect, useLoaderData } from 'react-router';
import { ProfileFactory } from 'src/factories/profileFactory.server';
import type { NewsCta } from 'src/pages/News/NewsMemberCta';
import { NewsPage } from 'src/pages/News/NewsPage';
import { NotFoundPage } from 'src/pages/NotFound/NotFound';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { NewsServiceServer } from 'src/services/newsService.server';
import { ProfileBadgeServiceServer } from 'src/services/profileBadgeService.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { redirectServiceServer } from 'src/services/redirectService.server';
import { TenantSettingsService } from 'src/services/tenantSettingsService.server';
import { renderNewsBodyHtml } from 'src/utils/renderNewsBodyHtml';
import { generateTags, mergeMeta } from 'src/utils/seo.utils';
import { ContentServiceServer } from '../services/contentService.server';
import { PollServiceServer } from '../services/pollService.server';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);

  const result = await new NewsServiceServer(client).getBySlug(params.slug!);
  const tenantSettings = await new TenantSettingsService(client).get();

  if (result.error || !result.data) {
    return data({ news: null, tenantSettings, cta: null }, { headers });
  }

  const dbNews = result.data as unknown as DBNews;
  const requiredBadgeIds = dbNews.profile_badges?.map((pb: any) => pb.profile_badges.id) || [];

  // No badge restrictions - allow public access
  if (requiredBadgeIds.length === 0) {
    const news = await loadNews(client, dbNews);
    return data({ news, tenantSettings, cta: null }, { headers });
  }

  const claims = await client.auth.getClaims();
  const dbProfile = claims.data?.claims
    ? await new ProfileServiceServer(client).getByAuthId(claims.data.claims.sub)
    : null;
  const profile = dbProfile ? new ProfileFactory(client).fromDB(dbProfile) : null;

  const isAdmin = !!(
    profile?.roles?.includes(UserRole.ADMIN) ||
    profile?.roles?.includes(UserRole.EDITOR) ||
    profile?.roles?.includes(UserRole.MODERATOR)
  );
  const access = await new NewsServiceServer(client).getAccess(
    dbNews.id,
    profile?.id ?? null,
    isAdmin,
  );

  if (access?.is_readable) {
    const news = await loadNews(client, dbNews);
    return data({ news, tenantSettings, cta: null }, { headers });
  }

  if (access?.cta_badge_id) {
    const news = await loadNews(client, lockNews(dbNews, access.cta_badge_id));
    const cta = await getNewsCta(client, tenantSettings, access.cta_badge_id);
    return data({ news, tenantSettings, cta }, { headers });
  }

  if (!profile) {
    return redirectServiceServer.redirectSignIn(`/news/${dbNews.slug}`, headers);
  }

  return redirect('/news', { headers });
}

function lockNews(dbNews: DBNews, ctaBadgeId: number): DBNews {
  return {
    ...dbNews,
    body: '',
    content: null,
    content_search_text: null,
    poll: null,
    is_locked: true,
    cta_badge_id: ctaBadgeId,
  };
}

async function getNewsCta(
  client: SupabaseClient,
  tenantSettings: TenantSettings,
  badgeId: number,
): Promise<NewsCta> {
  const badges = await new ProfileBadgeServiceServer(client).getAll();
  const badge = badges.find((x) => x.id === badgeId);

  return {
    title: tenantSettings.newsCtaTitle ?? null,
    body: tenantSettings.newsCtaBody ?? null,
    imageUrl: tenantSettings.newsCtaImageUrl ?? null,
    actionLabel: badge?.actionLabel ?? null,
    actionUrl: badge?.actionUrl ?? null,
  };
}

async function loadNews(client: SupabaseClient, dbNews: DBNews) {
  const contentService = new ContentServiceServer(client);
  if (!dbNews.is_locked) {
    await contentService.incrementViewCount('news', dbNews.total_views, dbNews!.id);
  }

  const [usefulVotes, subscribers, tags] = await contentService.getMetaFields(
    dbNews.id,
    'news',
    dbNews.tags,
  );

  const heroImage = await new NewsServiceServer(client).getHeroImage(dbNews.hero_image);

  let poll: PollDTO | null = null;
  if (dbNews.poll) {
    const claims = await client.auth.getClaims();
    const dbProfile = await new ProfileServiceServer(client).getByAuthId(
      claims?.data?.claims.sub ?? '',
    );
    if (dbProfile) {
      const profile = new ProfileFactory(client).fromDB(dbProfile!);
      const isAdmin = !!(
        profile.roles?.includes(UserRole.ADMIN) ||
        profile.roles?.includes(UserRole.EDITOR) ||
        profile.roles?.includes(UserRole.MODERATOR)
      );
      poll = await new PollServiceServer(client).getPoll(dbNews.poll, profile.id, isAdmin);
    } else {
      poll = await new PollServiceServer(client).getPoll(dbNews.poll);
    }
  }

  const news = News.fromDB(dbNews, tags, heroImage, poll, renderNewsBodyHtml);
  news.usefulCount = usefulVotes.count || 0;
  news.subscriberCount = subscribers.count || 0;

  return news;
}

export const meta = mergeMeta<typeof loader>(({ loaderData }) => {
  const news = (loaderData as any)?.news as News;

  if (!news) {
    return [];
  }

  const title = `${news.title} - News - ${loaderData?.tenantSettings?.siteName}`;
  const imageUrl = news.heroImage?.publicUrl;

  return generateTags(title, news.summary || '', imageUrl, { type: 'article' });
});

export default function Index() {
  const data = useLoaderData<typeof loader>();

  if (!data.news) {
    return <NotFoundPage />;
  }

  return <NewsPage news={data.news} cta={data.cta} />;
}
