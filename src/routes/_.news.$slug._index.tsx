import type { DBNews } from 'oa-shared';
import { News, UserRole } from 'oa-shared';
import type { LoaderFunctionArgs } from 'react-router';
import { redirect, useLoaderData } from 'react-router';
import { ProfileFactory } from 'src/factories/profileFactory.server';
import { NewsPage } from 'src/pages/News/NewsPage';
import { NotFoundPage } from 'src/pages/NotFound/NotFound';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { newsServiceServer } from 'src/services/newsService.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { redirectServiceServer } from 'src/services/redirectService.server';
import { generateTags, mergeMeta } from 'src/utils/seo.utils';
import { contentServiceServer } from '../services/contentService.server';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);

  const result = await newsServiceServer.getBySlug(client, params.slug!);

  if (result.error || !result.data) {
    return Response.json({ news: null }, { headers });
  }

  const dbNews = result.data as unknown as DBNews;
  const profileBadgeId = dbNews.profile_badge?.id;

  if (!profileBadgeId) {
    const news = await loadNews(client, dbNews);
    return Response.json({ news }, { headers });
  }

  const claims = await client.auth.getClaims();

  if (!claims.data?.claims) {
    return redirectServiceServer.redirectSignIn(`/news/${dbNews.slug}`, headers);
  }

  const profileService = new ProfileServiceServer(client);
  const dbProfile = await profileService.getByAuthId(claims.data.claims.sub);
  const profile = new ProfileFactory(client).fromDB(dbProfile!);

  const isAdmin = profile.roles?.includes(UserRole.ADMIN) ?? false;
  const hasLinkedBadge = !!profile?.badges?.find((badge) => badge.id === profileBadgeId);

  if (isAdmin || hasLinkedBadge) {
    const news = await loadNews(client, dbNews);
    return Response.json({ news }, { headers });
  }

  return redirect('/news');
}

async function loadNews(client, dbNews) {
  await contentServiceServer.incrementViewCount(client, 'news', dbNews.total_views, dbNews!.id);

  const [usefulVotes, subscribers, tags] = await contentServiceServer.getMetaFields(
    client,
    dbNews.id,
    'news',
    dbNews.tags,
  );

  const heroImage = await newsServiceServer.getHeroImage(client, dbNews.hero_image);

  const news = News.fromDB(dbNews, tags, heroImage);
  news.usefulCount = usefulVotes.count || 0;
  news.subscriberCount = subscribers.count || 0;

  return news;
}

export function HydrateFallback() {
  // This is required because all routes are loaded client-side. Avoids a page flicker before css is loaded.
  // Can be removed once ALL pages are using SSR.
  return <div></div>;
}

export const meta = mergeMeta<typeof loader>(({ loaderData }) => {
  const news = (loaderData as any)?.news as News;

  if (!news) {
    return [];
  }

  const title = `${news.title} - News - ${import.meta.env.VITE_SITE_NAME}`;
  const imageUrl = news.heroImage?.publicUrl;

  return generateTags(title, news.body, imageUrl);
});

export default function Index() {
  const data = useLoaderData();
  const news = data.news as News;

  if (!news) {
    return <NotFoundPage />;
  }

  return <NewsPage news={news} />;
}
