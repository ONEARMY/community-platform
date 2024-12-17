import { useLoaderData } from '@remix-run/react'
import { Question } from 'src/models/question.model'
import { NotFoundPage } from 'src/pages/NotFound/NotFound'
import { QuestionPage } from 'src/pages/Question/QuestionPage'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { generateTags, mergeMeta } from 'src/utils/seo.utils'

import type { LoaderFunctionArgs } from '@remix-run/node'
import type { DBQuestion } from 'src/models/question.model'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request)

  const result = await client
    .from('questions')
    .select(
      `
      id,
      created_at,
      created_by,
      modified_at,
      comment_count,
      description,
      moderation,
      slug,
      category,
      tags,
      title,
      total_views,
      tenant_id,
      profiles(id, firebase_auth_id, display_name, username, is_verified, country)
    `,
    )
    .or(`slug.eq.${params.slug},previous_slugs.cs.{"${params.slug}"}`)
    .neq('deleted', true)
    .single()

  if (result.error || !result.data) {
    return Response.json({ question: null }, { headers })
  }

  const dbQuestion = result.data as unknown as DBQuestion

  if (dbQuestion.id) {
    client
      .from('questions')
      .update({ total_views: (dbQuestion.total_views || 0) + 1 })
      .eq('id', dbQuestion.id)
  }

  const question = Question.fromDB(dbQuestion)

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
  const imageUrl = question.images?.at(0)?.url

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
