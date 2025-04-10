import { useLoaderData } from '@remix-run/react'
import { ResearchItem, Tag } from 'oa-shared'
import { NotFoundPage } from 'src/pages/NotFound/NotFound'
import { ResearchArticlePage } from 'src/pages/Research/Content/ResearchArticlePage'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { researchServiceServer } from 'src/services/researchService.server'
import { generateTags, mergeMeta } from 'src/utils/seo.utils'

import type { LoaderFunctionArgs } from '@remix-run/node'
import type { DBResearchItem, ResearchUpdate } from 'oa-shared'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request)

  const result = await researchServiceServer.getBySlug(
    client,
    params.slug as string,
  )

  if (result.error || !result.data) {
    return Response.json({ research: null }, { headers })
  }

  const {
    data: { user },
  } = await client.auth.getUser()
  let currentUserId: number | undefined

  if (user) {
    const result = await client
      .from('profiles')
      .select('id')
      .eq('auth_id', user.id)
      .limit(1)
    currentUserId = result.data?.at(0)?.id
  }

  const dbResearch = result.data as unknown as DBResearchItem

  if (dbResearch.id) {
    await client
      .from('research')
      .update({ total_views: (dbResearch.total_views || 0) + 1 })
      .eq('id', dbResearch.id)
  }

  const tagIds = dbResearch.tags
  let tags: Tag[] = []
  if (tagIds?.length > 0) {
    const tagsResult = await client.from('tags').select('*').in('id', tagIds)

    if (tagsResult.data) {
      tags = tagsResult.data.map((x) => Tag.fromDB(x))
    }
  }

  const [usefulVotes, subscribers] = await Promise.all([
    client
      .from('useful_votes')
      .select('*', { count: 'exact' })
      .eq('content_id', dbResearch.id)
      .eq('content_type', 'research'),
    client
      .from('subscribers')
      .select('user_id', { count: 'exact' })
      .eq('content_id', dbResearch.id)
      .eq('content_type', 'research'),
  ])

  const images = researchServiceServer.getResearchPublicMedia(
    dbResearch,
    client,
  )

  const research = ResearchItem.fromDB(
    dbResearch,
    tags,
    images,
    [], // TODO
    currentUserId,
  )
  research.usefulCount = usefulVotes.count || 0
  research.subscriberCount = subscribers.count || 0

  return Response.json({ research }, { headers })
}

export function HydrateFallback() {
  // This is required because all routes are loaded client-side. Avoids a page flicker before css is loaded.
  // Can be removed once ALL pages are using SSR.
  return <div></div>
}

export const meta = mergeMeta<typeof loader>(({ data }) => {
  const research = data?.research as ResearchItem
  const publicUpdates = data?.publicUpdates as ResearchUpdate[]

  if (!research) {
    return []
  }

  const title = `${research.title} - Research - ${import.meta.env.VITE_SITE_NAME}`

  return generateTags(
    title,
    research.description,
    (publicUpdates?.at(0)?.images?.[0] as any)?.downloadUrl,
  )
})

export default function Index() {
  const data = useLoaderData<typeof loader>()
  const research = data.research as ResearchItem

  if (!research) {
    return <NotFoundPage />
  }

  return <ResearchArticlePage research={research} />
}
