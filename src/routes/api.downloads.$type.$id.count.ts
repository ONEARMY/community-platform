import { createSupabaseServerClient } from 'src/repository/supabase.server'

import type { ActionFunctionArgs } from '@remix-run/node'

export async function action({ params, request }: ActionFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request)

  const {
    data: { user },
  } = await client.auth.getUser()

  if (!user) {
    return Response.json({}, { status: 401, headers })
  }

  const tableName = resolveTableName(params.type)

  if (!tableName) {
    return Response.json({}, { status: 400, headers })
  }

  const { data } = await client
    .from(tableName)
    .select('file_download_count')
    .eq('id', params.id)
    .single()

  if (!data) {
    return Response.json({}, { status: 400, statusText: 'invalid id', headers })
  }

  await client
    .from(tableName)
    .update({
      file_download_count: (data.file_download_count || 0) + 1,
    })
    .eq('id', params.id)

  return Response.json(null, { status: 201, headers })
}

function resolveTableName(type: string | undefined): string | null {
  switch (type) {
    case 'project':
      return 'projects'
    case 'research_update':
      return 'research_updates'
    default:
      return null
  }
}
