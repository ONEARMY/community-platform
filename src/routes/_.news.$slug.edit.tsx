import type { SupabaseClient } from '@supabase/supabase-js';
import { DBNews, NewsFormData, UserRole } from 'oa-shared';
import type { LoaderFunctionArgs } from 'react-router';
import { data, redirect, useLoaderData } from 'react-router';
import { NewsForm } from 'src/pages/News/Content/Common/NewsForm';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { NewsServiceServer } from 'src/services/newsService.server';
import { redirectServiceServer } from 'src/services/redirectService.server';
import { StorageServiceServer } from 'src/services/storageService.server';
import { PollServiceServer } from '../services/pollService.server';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);

  const claims = await client.auth.getClaims();

  if (!claims.data?.claims) {
    return redirectServiceServer.redirectSignIn(`/news/${params.slug}/edit`, headers);
  }

  if (!params.slug) {
    return data({ formData: null, id: null }, { headers });
  }

  const result = await new NewsServiceServer(client).getBySlug(params.slug!);

  if (result.error || !result.data) {
    return data({ formData: null, id: null }, { headers });
  }

  if (!(await isAllowedToEdit(result.data.created_by, claims.data.claims.sub, client))) {
    return redirect('/forbidden?page=news-edit', { headers });
  }

  const dbNews = result.data as unknown as DBNews;

  const publicImage = dbNews.hero_image
    ? new StorageServiceServer(client).getPublicUrl(dbNews.hero_image)
    : null;

  const pollService = new PollServiceServer(client);
  const poll = dbNews.poll ? await pollService.getPoll(dbNews.poll) : null;

  const formData: NewsFormData = DBNews.toFormData(dbNews, publicImage, poll);

  return data({ formData, id: result.data.id }, { headers });
}

async function isAllowedToEdit(userProfileId: string, userAuthId: string, client: SupabaseClient) {
  const { data } = await client
    .from('profiles')
    .select('id,roles')
    .eq('auth_id', userAuthId)
    .single();

  return (
    data?.roles?.includes(UserRole.ADMIN) ||
    data?.roles?.includes(UserRole.EDITOR) ||
    (userProfileId && data?.id === userProfileId)
  );
}

export default function Index() {
  const { formData, id } = useLoaderData<typeof loader>();

  return <NewsForm data-testid="news-create-form" formAction="edit" id={id} formData={formData} />;
}
