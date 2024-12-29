import { useLoaderData } from '@remix-run/react'
import { Question } from 'src/models/question.model'
import { AuthRoute } from 'src/pages/common/AuthRoute'
import { QuestionEdit } from 'src/pages/Question/QuestionEdit'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { questionServiceServer } from 'src/services/questionService.server'

import type { LoaderFunctionArgs } from '@remix-run/node'
import type { DBQuestion } from 'src/models/question.model'

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

  const question = Question.fromDB(dbQuestion, [])

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
