import { useLoaderData } from '@remix-run/react'
import { Question } from 'oa-shared'
import { IMAGE_SIZES } from 'src/config/imageTransforms'
import { AuthRoute } from 'src/pages/common/AuthRoute'
import { QuestionEdit } from 'src/pages/Question/QuestionEdit'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { questionServiceServer } from 'src/services/questionService.server'
import { storageServiceServer } from 'src/services/storageService.server'

import type { LoaderFunctionArgs } from '@remix-run/node'
import type { DBQuestion } from 'oa-shared'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request)

  if (!params.slug) {
    return Response.json({ question: null }, { headers })
  }

  const result = await questionServiceServer.getBySlug(client, params.slug!)

  if (result.error || !result.data) {
    return Response.json({ question: null }, { headers })
  }

  const dbQuestion = result.data as unknown as DBQuestion

  const images = dbQuestion.images
    ? storageServiceServer.getImagesPublicUrls(
        client,
        dbQuestion.images,
        IMAGE_SIZES.GALLERY,
      )
    : []

  const question = Question.fromDB(dbQuestion, [], images)

  return Response.json({ question }, { headers })
}

export default function Index() {
  const data = useLoaderData<typeof loader>()
  const question = data.question as Question

  return (
    <AuthRoute>
      <QuestionEdit question={question} />
    </AuthRoute>
  )
}
