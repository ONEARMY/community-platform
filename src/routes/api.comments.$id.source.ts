import { createSupabaseServerClient } from 'src/repository/supabase.server'

import type { LoaderFunctionArgs } from 'react-router';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const id = Number(params.id)

  const { client, headers } = createSupabaseServerClient(request)

  const result = await client
    .from('comments')
    .select('source_id')
    .eq('id', id)
    .single()

  return Response.json({ sourceId: result.data?.source_id }, { headers })
}
