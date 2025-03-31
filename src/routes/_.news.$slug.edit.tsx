import { useLoaderData } from '@remix-run/react'
import { News } from 'oa-shared'
import { AuthRoute } from 'src/pages/common/AuthRoute'
import { NewsEdit } from 'src/pages/News/NewsEdit'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { newsServiceServer } from 'src/services/newsService.server'
import { tagsServiceServer } from 'src/services/tagsService.server'

import type { LoaderFunctionArgs } from '@remix-run/node'
import type { DBNews } from 'oa-shared'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request)

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

export default function Index() {
  const data = useLoaderData<typeof loader>()
  const news = data.news as News

  return (
    <AuthRoute>
      <NewsEdit news={news} />
    </AuthRoute>
  )
}
