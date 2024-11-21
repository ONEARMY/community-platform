import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { createSupabaseServerClient } from 'src/repository/supabase.server'

export async function action({ request }: LoaderFunctionArgs) {
  if (request.method !== 'POST') {
    return json({}, { status: 405, statusText: 'method not allowed' })
  }

  const data = await request.json()

  if (!data.ids) {
    return json({}, { status: 400, statusText: 'ids is required' })
  }

  const { client, headers } = createSupabaseServerClient(request)

  // It would be more efficient to make a group by query.
  // But it isn't supported by the sdk. Can create an sql function if performance is an issue.
  // Also, this won't be needed once we fully migrate to supabase.
  const commentsResult = await client
    .from('comments')
    .select('source_id_legacy')
    .in('source_id_legacy', data.ids)

  const commentCounts = commentsResult.data?.reduce((acc, comment) => {
    acc[comment.source_id_legacy] = (acc[comment.source_id_legacy] || 0) + 1
    return acc
  }, {})

  return json(commentCounts, {
    headers,
    status: commentsResult.error ? 500 : 201,
  })
}
