import { redirect } from '@remix-run/node'
import { createSupabaseServerClient } from 'src/repository/supabase.server'

import type { LoaderFunctionArgs } from '@remix-run/node'

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request)

  const {
    data: { user },
  } = await client.auth.getUser()

  if (!user) {
    return Response.json({}, { status: 401, headers })
  }

  const folderName = resolveStorageFolderName(params.type)
  const contentId = params.contentId
  const docId = params.docId
  const bucket = `${process.env.TENANT_ID}-documents`

  if (!folderName || !contentId) {
    return Response.json({}, { status: 400, headers })
  }

  const { data } = await client.storage
    .from(bucket)
    .list(`${folderName}/${contentId}`)

  const file = data?.find((x) => x.id === docId)

  if (!data || !file) {
    return Response.json({}, { status: 404, headers })
  }

  const result = await client.storage
    .from(bucket)
    .createSignedUrl(`${folderName}/${contentId}/${file.name}`, 3600, {
      download: true,
    })

  if (!result.data?.signedUrl) {
    console.error(result.error)
    return Response.json({}, { status: 500 })
  }

  return redirect(result.data?.signedUrl)
}

function resolveStorageFolderName(type: string | undefined): string | null {
  if (type === 'library' || type === 'research') {
    return type
  }

  return null
}
