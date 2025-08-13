import { createSupabaseServerClient } from 'src/repository/supabase.server'

import type { LoaderFunctionArgs } from '@remix-run/node'

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request)

  const profileTagsResult = await client
    .from('profile_tags')
    .select('id,created_at,name,profile_type')

  const tags = profileTagsResult.data || []

  return Response.json(tags, { headers, status: 200 })
}
