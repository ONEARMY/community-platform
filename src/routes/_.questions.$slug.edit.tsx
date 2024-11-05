import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { AuthRoute } from 'src/pages/common/AuthRoute'
import { questionService } from 'src/pages/Question/question.service'
import { QuestionEdit } from 'src/pages/Question/QuestionEdit'

import type { LoaderFunctionArgs } from '@remix-run/node'
import type { IQuestionDB } from 'oa-shared'

export async function loader({ params }: LoaderFunctionArgs) {
  const question = await questionService.getBySlug(params.slug as string)

  return json({ question })
}

export default function Index() {
  const data = useLoaderData<typeof loader>()
  const question = data.question as IQuestionDB

  return (
    <AuthRoute>
      <QuestionEdit question={question} />
    </AuthRoute>
  )
}
