import { redirect, useLoaderData } from 'react-router';
import { News, UserRole } from 'oa-shared';
import { NewsForm } from 'src/pages/News/Content/Common/NewsForm';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { newsServiceServer } from 'src/services/newsService.server';
import { redirectServiceServer } from 'src/services/redirectService.server';
import { tagsServiceServer } from 'src/services/tagsService.server';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { DBNews } from 'oa-shared';
import type { LoaderFunctionArgs } from 'react-router';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);

  const claims = await client.auth.getClaims();

  if (!claims.data?.claims) {
    return redirectServiceServer.redirectSignIn(`/news/${params.slug}/edit`, headers);
  }

  if (!(await isAllowedToEdit(claims.data.claims.sub, client))) {
    return redirect('/forbidden?page=news-edit', { headers });
  }

  if (!params.slug) {
    return Response.json({ news: null }, { headers });
  }

  const result = await newsServiceServer.getBySlug(client, params.slug!);

  if (result.error || !result.data) {
    return Response.json({ news: null }, { headers });
  }

  const dbNews = result.data as unknown as DBNews;
  const tags = await tagsServiceServer.getTags(client, dbNews.tags);
  const heroImage = await newsServiceServer.getHeroImage(client, dbNews.hero_image);
  const news = News.fromDB(dbNews, tags, heroImage);

  return Response.json({ news }, { headers });
}

async function isAllowedToEdit(userAuthId: string, client: SupabaseClient) {
  const { data } = await client
    .from('profiles')
    .select('id,roles')
    .eq('auth_id', userAuthId)
    .single();

  return data?.roles?.includes(UserRole.ADMIN);
}

export function HydrateFallback() {
  // This is required because all routes are loaded client-side. Avoids a page flicker before css is loaded.
  // Can be removed once ALL pages are using SSR.
  return <div></div>;
}

export default function Index() {
  const data = useLoaderData();
  const news = data.news as News;

  return <NewsForm data-testid="news-create-form" parentType="edit" news={news} />;
}
