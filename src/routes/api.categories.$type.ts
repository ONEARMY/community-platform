import { createSupabaseServerClient } from 'src/repository/supabase.server'

import type { LoaderFunctionArgs } from '@remix-run/node'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request)

  if (!params.type) {
    return Response.json(
      {},
      { headers, status: 400, statusText: 'type is required' },
    )
  }

  const categoriesResult = await client
    .from('categories')
    .select('id,name,created_at')
    .eq('type', params.type)

  const categories = categoriesResult.data || []

  return Response.json(categories, { headers, status: 200 })
}
