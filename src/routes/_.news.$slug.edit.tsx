import { redirect, useLoaderData } from '@remix-run/react'
import { News, UserRole } from 'oa-shared'
import { NewsForm } from 'src/pages/News/Content/Common'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { newsServiceServer } from 'src/services/newsService.server'
import { tagsServiceServer } from 'src/services/tagsService.server'

import type { LoaderFunctionArgs } from '@remix-run/node'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import type { DBNews } from 'oa-shared'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request)

  const {
    data: { user },
  } = await client.auth.getUser()

  if (!(await isAllowedToEdit(user, client))) {
    return redirect('/news', { headers })
  }

  if (!params.slug) {
    return Response.json({ news: null }, { headers })
  }

  const result = await newsServiceServer.getBySlug(client, params.slug!)

  if (result.error || !result.data) {
    return Response.json({ news: null }, { headers })
  }

  const dbNews = result.data as unknown as DBNews
  const tags = await tagsServiceServer.getTags(client, dbNews.tags)
  const heroImage = await newsServiceServer.getHeroImage(
    client,
    dbNews.hero_image,
  )
  const news = News.fromDB(dbNews, tags, heroImage)

  return Response.json({ news }, { headers })
}

async function isAllowedToEdit(user: User | null, client: SupabaseClient) {
  if (!user) {
    return false
  }

  const { data } = await client
    .from('profiles')
    .select('id,roles')
    .eq('auth_id', user.id)
    .single()

  return data?.roles?.includes(UserRole.ADMIN)
}

export function HydrateFallback() {
  // This is required because all routes are loaded client-side. Avoids a page flicker before css is loaded.
  // Can be removed once ALL pages are using SSR.
  return <div></div>
}

export default function Index() {
  const data = useLoaderData<typeof loader>()
  const news = data.news as News

  return (
    <NewsForm data-testid="news-create-form" parentType="edit" news={news} />
  )
}
