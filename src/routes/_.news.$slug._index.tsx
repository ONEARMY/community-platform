import { useLoaderData } from '@remix-run/react'
import { News } from 'oa-shared'
import { NewsPage } from 'src/pages/News/NewsPage'
import { NotFoundPage } from 'src/pages/NotFound/NotFound'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { newsServiceServer } from 'src/services/newsService.server'
import { generateTags, mergeMeta } from 'src/utils/seo.utils'

import { contentServiceServer } from '../services/contentService.server'

import type { LoaderFunctionArgs } from '@remix-run/node'
import type { DBNews } from 'oa-shared'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request)

  const result = await newsServiceServer.getBySlug(client, params.slug!)

  if (result.error || !result.data) {
    return Response.json({ news: null }, { headers })
  }

  const dbNews = result.data as unknown as DBNews

  if (dbNews.id) {
    await contentServiceServer.incrementViewCount(
      client,
      'news',
      dbNews.total_views,
      dbNews.id,
    )
  }

  const [usefulVotes, subscribers, tags] =
    await contentServiceServer.getMetaFields(
      client,
      dbNews.id,
      'news',
      dbNews.tags,
    )

  const heroImage = await newsServiceServer.getHeroImage(
    client,
    dbNews.hero_image,
  )

  const news = News.fromDB(dbNews, tags, heroImage)
  news.usefulCount = usefulVotes.count || 0
  news.subscriberCount = subscribers.count || 0

  return Response.json({ news }, { headers })
}

export function HydrateFallback() {
  // This is required because all routes are loaded client-side. Avoids a page flicker before css is loaded.
  // Can be removed once ALL pages are using SSR.
  return <div></div>
}

export const meta = mergeMeta<typeof loader>(({ data }) => {
  const news = data?.news as News

  if (!news) {
    return []
  }

  const title = `${news.title} - News - ${import.meta.env.VITE_SITE_NAME}`
  const imageUrl = news.heroImage?.publicUrl

  return generateTags(title, news.body, imageUrl)
})

export default function Index() {
  const data = useLoaderData<typeof loader>()
  const news = data.news as News

  if (!news) {
    return <NotFoundPage />
  }

  return <NewsPage news={news} />
}
