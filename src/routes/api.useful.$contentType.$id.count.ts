import { createSupabaseServerClient } from 'src/repository/supabase.server'

import type { LoaderFunctionArgs } from 'react-router';
import type { UsefulContentType } from 'oa-shared'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request)

  const { contentType, id } = params

  const allowedContentTypes = [
    'questions',
    'projects',
    'research',
    'news',
    'comments',
  ] as const satisfies readonly UsefulContentType[]

  if (!allowedContentTypes.includes(contentType as UsefulContentType)) {
    return Response.json({ error: 'Unsupported content type' }, { status: 400 })
  }

  const commentId = Number(id)

  if (!commentId || commentId <= 0 || !Number.isInteger(commentId)) {
    return Response.json({ error: 'Invalid comment ID' }, { status: 400 })
  }

  const { data, error } = await client
    .from('useful_votes')
    .select('content_id')
    .eq('content_type', contentType)
    .eq('content_id', commentId)

  if (error) {
    console.error('Supabase error:', error)
    return Response.json(
      { error: 'Error fetching votes' },
      { status: 500, headers },
    )
  }

  const count = Array.isArray(data) ? data.length : 0

  return Response.json({ count }, { headers, status: 200 })
}
