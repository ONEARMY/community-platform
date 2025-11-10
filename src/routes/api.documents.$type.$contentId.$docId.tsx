import { redirect } from 'react-router';
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { resolveType } from 'src/utils/contentType.utils'

import type { LoaderFunctionArgs } from 'react-router';
import type { Params } from 'react-router';
import type { SupabaseClient } from '@supabase/supabase-js'
import type { DBResearchUpdate, IDBDownloadable } from 'oa-shared'

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request)

  const claims = await client.auth.getClaims()

  if (!claims.data?.claims) {
    return Response.json({}, { status: 401, headers })
  }

  const result = await resolveUrl(params, client, headers)

  if (result.status === 302) {
    // 302 status means the file is returned
    await incrementDownloadCount(params.type!, +params.contentId!, client)
  }

  return result
}

async function resolveUrl(
  params: Params<string>,
  client: SupabaseClient,
  headers,
) {
  const tableName = resolveType(params.type!)
  const contentId = +params.contentId!
  const docId = params.docId!

  if (!tableName) {
    return Response.json({}, { status: 400, headers })
  }

  if (docId === 'link') {
    return await resolveFileLink(tableName, contentId, client, headers)
  }

  const path = await resolvePath(tableName, contentId, client)
  const bucket = `${process.env.TENANT_ID}-documents`

  if (!path) {
    return Response.json({}, { status: 400, headers })
  }

  const { data } = await client.storage.from(bucket).list(path)

  const file = data?.find((x) => x.id === docId)

  if (!data || !file) {
    return Response.json({}, { status: 404, headers })
  }

  const result = await client.storage
    .from(bucket)
    .createSignedUrl(`${path}/${file.name}`, 3600, {
      download: true,
    })

  if (!result.data?.signedUrl) {
    console.error(result.error)
    return Response.json({}, { status: 500, headers })
  }

  return redirect(result.data?.signedUrl)
}

async function resolveFileLink(
  tableName: string,
  id: number,
  client: SupabaseClient,
  headers: Headers,
) {
  const { data, error } = await client
    .from(tableName)
    .select('id,file_link')
    .eq('id', id)
    .single()

  if (!data) {
    console.error(error)
    return Response.json({}, { status: 500, headers })
  }

  return redirect(data.file_link)
}

async function incrementDownloadCount(
  type: string,
  contentId: number,
  client: SupabaseClient,
) {
  const tableName = resolveType(type)!

  const { data } = await client
    .from(tableName)
    .select('id,file_download_count')
    .eq('id', +contentId)
    .single()
  const downloadableDoc = data as Partial<IDBDownloadable>

  await client
    .from(tableName)
    .update({
      file_download_count: (downloadableDoc.file_download_count || 0) + 1,
    })
    .eq('id', +contentId)
}

async function resolvePath(
  tableName: string,
  contentId: number,
  client: SupabaseClient,
): Promise<string | null> {
  if (tableName === 'projects' || tableName === 'research') {
    return `${tableName}/${contentId}`
  }

  if (tableName === 'research_updates') {
    const { data, error } = await client
      .from('research_updates')
      .select('id,research_id')
      .eq('id', +contentId)
      .single()

    if (!data) {
      console.error(error)
      return null
    }

    const update = data as DBResearchUpdate

    return `research/${update.research_id}/updates/${update.id}`
  }

  return null
}
