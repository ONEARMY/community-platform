import { redirect, useLoaderData } from 'react-router'
import { Question, UserRole } from 'oa-shared'
import { IMAGE_SIZES } from 'src/config/imageTransforms'
import { QuestionForm } from 'src/pages/Question/Content/Common/QuestionForm'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { questionServiceServer } from 'src/services/questionService.server'
import { redirectServiceServer } from 'src/services/redirectService.server'
import { storageServiceServer } from 'src/services/storageService.server'

import type { SupabaseClient } from '@supabase/supabase-js'
import type { DBQuestion, Image } from 'oa-shared'
import type { LoaderFunctionArgs } from 'react-router'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request)

  const claims = await client.auth.getClaims()

  if (!claims.data?.claims) {
    return redirectServiceServer.redirectSignIn(
      `/questions/${params.slug}/edit`,
      headers,
    )
  }

  if (!params.slug) {
    return Response.json({ question: null }, { headers })
  }

  const result = await questionServiceServer.getBySlug(client, params.slug!)

  if (result.error || !result.data) {
    return Response.json({ question: null }, { headers })
  }

  const dbQuestion = result.data as unknown as DBQuestion

  if (
    !(await isUserAllowedToEdit(dbQuestion, claims.data.claims.sub, client))
  ) {
    return redirect('/forbidden?page=question-edit', { headers })
  }

  let images: Image[] = []
  if (dbQuestion.images) {
    images = storageServiceServer.getPublicUrls(
      client,
      dbQuestion.images,
      IMAGE_SIZES.GALLERY,
    )
  }

  const question = Question.fromDB(dbQuestion, [], images)

  return Response.json({ question }, { headers })
}

async function isUserAllowedToEdit(
  dbQuestion: DBQuestion,
  userAuthId: string,
  client: SupabaseClient,
) {
  const profileResult = await client
    .from('profiles')
    .select('id,roles')
    .eq('auth_id', userAuthId)
    .single()

  return (
    profileResult.data?.roles?.includes(UserRole.ADMIN) ||
    profileResult.data?.id === dbQuestion.author?.id
  )
}

export default function Index() {
  const data: any = useLoaderData<typeof loader>()
  const question = data.question as Question

  return (
    <QuestionForm
      data-testid="question-create-form"
      parentType="edit"
      question={question}
    />
  )
}
