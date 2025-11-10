import { ProfileTag } from 'oa-shared'
import { createSupabaseServerClient } from 'src/repository/supabase.server'

import type { LoaderFunctionArgs } from 'react-router';
import type { DBProfileTag } from 'oa-shared'

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request)

  const profileTagsResult = await client
    .from('profile_tags')
    .select('id,created_at,name,profile_type')

  const dbTags = (profileTagsResult.data || []) as unknown as DBProfileTag[]
  const tags = dbTags.map((x) => ProfileTag.fromDB(x))

  return Response.json(tags, { headers, status: 200 })
}
