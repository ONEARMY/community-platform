import { useLoaderData } from '@remix-run/react'
import { IMAGE_SIZES } from 'src/config/imageTransforms'
import { Question } from 'src/models/question.model'
import { Tag } from 'src/models/tag.model'
import { NotFoundPage } from 'src/pages/NotFound/NotFound'
import { QuestionPage } from 'src/pages/Question/QuestionPage'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { questionServiceServer } from 'src/services/questionService.server'
import { storageServiceServer } from 'src/services/storageService.server'
import { generateTags, mergeMeta } from 'src/utils/seo.utils'

import type { LoaderFunctionArgs } from '@remix-run/node'
import type { DBQuestion } from 'src/models/question.model'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request)

  const result = await questionServiceServer.getBySlug(client, params.slug!)

  if (result.error || !result.data) {
    return Response.json({ question: null }, { headers })
  }

  const dbQuestion = result.data as unknown as DBQuestion

  if (dbQuestion.id) {
    await client
      .from('questions')
      .update({ total_views: (dbQuestion.total_views || 0) + 1 })
      .eq('id', dbQuestion.id)
  }

  const tagIds = dbQuestion.tags
  let tags: Tag[] = []
  if (tagIds?.length > 0) {
    const tagsResult = await client
      .from('tags')
      .select('id,name')
      .in('id', tagIds)

    if (tagsResult.data) {
      tags = tagsResult.data.map((x) => Tag.fromDB(x))
    }
  }

  const [usefulVotes, subscribers] = await Promise.all([
    client
      .from('useful_votes')
      .select('*', { count: 'exact' })
      .eq('content_id', dbQuestion.id)
      .eq('content_type', 'questions'),
    client
      .from('subscribers')
      .select('user_id', { count: 'exact' })
      .eq('content_id', dbQuestion.id)
      .eq('content_type', 'questions'),
  ])

  const images = dbQuestion.images
    ? storageServiceServer.getPublicUrls(
        client,
        dbQuestion.images,
        IMAGE_SIZES.GALLERY,
      )
    : []

  const question = Question.fromDB(dbQuestion, tags, images)
  question.usefulCount = usefulVotes.count || 0
  question.subscriberCount = subscribers.count || 0

  return Response.json({ question }, { headers })
}

export function HydrateFallback() {
  // This is required because all routes are loaded client-side. Avoids a page flicker before css is loaded.
  // Can be removed once ALL pages are using SSR.
  return <div></div>
}

export const meta = mergeMeta<typeof loader>(({ data }) => {
  const question = data?.question as Question

  if (!question) {
    return []
  }

  const title = `${question.title} - Question - ${import.meta.env.VITE_SITE_NAME}`
  const imageUrl = question.images?.at(0)?.publicUrl

  return generateTags(title, question.description, imageUrl)
})

export default function Index() {
  const data = useLoaderData<typeof loader>()
  const question = data.question as Question

  if (!question) {
    return <NotFoundPage />
  }

  return <QuestionPage question={question} />
}
