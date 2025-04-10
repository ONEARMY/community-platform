import { useLoaderData } from '@remix-run/react'
import { Question } from 'oa-shared'
import { IMAGE_SIZES } from 'src/config/imageTransforms'
import { NotFoundPage } from 'src/pages/NotFound/NotFound'
import { QuestionPage } from 'src/pages/Question/QuestionPage'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { questionServiceServer } from 'src/services/questionService.server'
import { storageServiceServer } from 'src/services/storageService.server'
import { generateTags, mergeMeta } from 'src/utils/seo.utils'

import { utilsServiceServer } from '../services/utilsService.server'

import type { LoaderFunctionArgs } from '@remix-run/node'
import type { DBQuestion } from 'oa-shared'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request)

  const result = await questionServiceServer.getBySlug(client, params.slug!)

  if (result.error || !result.data) {
    return Response.json({ question: null }, { headers })
  }

  const dbQuestion = result.data as unknown as DBQuestion

  if (dbQuestion.id) {
    await utilsServiceServer.incrementViewCount(
      client,
      'questions',
      dbQuestion.total_views,
      dbQuestion.id,
    )
  }

  const [usefulVotes, subscribers, tags] =
    await utilsServiceServer.getMetaFields(
      client,
      dbQuestion.id,
      dbQuestion.tags,
    )

  const images = storageServiceServer.getPublicUrls(
    client,
    dbQuestion.images!,
    IMAGE_SIZES.GALLERY,
  )

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
