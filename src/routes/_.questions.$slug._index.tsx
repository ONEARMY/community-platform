import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { NotFoundPage } from 'src/pages/NotFound/NotFound'
import { questionService } from 'src/pages/Question/question.service'
import { QuestionPage } from 'src/pages/Question/QuestionPage'
import { pageViewService } from 'src/services/pageView.service'
import { generateTags, mergeMeta } from 'src/utils/seo.utils'

import type { LoaderFunctionArgs } from '@remix-run/node'
import type { IQuestionDB, IUploadedFileMeta } from 'oa-shared'

export async function loader({ params }: LoaderFunctionArgs) {
  const question = await questionService.getBySlug(params.slug as string)

  if (question?._id) {
    // not awaited to not block the render
    pageViewService.incrementViewCount('questions', question._id)
  }

  return json({ question })
}

export const meta = mergeMeta<typeof loader>(({ data }) => {
  const question = data?.question as IQuestionDB

  if (!question) {
    return []
  }

  const title = `${question.title} - Question - ${import.meta.env.VITE_SITE_NAME}`
  const imageUrl = (question.images?.at(0) as IUploadedFileMeta)?.downloadUrl

  return generateTags(title, question.description, imageUrl)
})

export default function Index() {
  const data = useLoaderData<typeof loader>()
  const question = data.question as IQuestionDB

  if (!question) {
    return <NotFoundPage />
  }

  return <QuestionPage question={question} />
}
