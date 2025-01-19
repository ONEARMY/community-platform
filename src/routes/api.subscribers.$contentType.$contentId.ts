import { verifyFirebaseToken } from 'src/firestore/firestoreAdmin.server'
import { createSupabaseServerClient } from 'src/repository/supabase.server'

import type { LoaderFunctionArgs } from '@remix-run/node'

export async function action({ request, params }: LoaderFunctionArgs) {
  if (request.method !== 'POST' && request.method !== 'DELETE') {
    return Response.json({}, { status: 405, statusText: 'method not allowed' })
  }

  const { valid, error, user_id } = await verifyFirebaseToken(
    request.headers.get('firebaseToken')!,
  )

  if (!valid) {
    console.error(error)
    return Response.json({}, { status: 401, statusText: 'unauthorized' })
  }

  const { client, headers } = createSupabaseServerClient(request)

  const profileResult = await client
    .from('profiles')
    .select()
    .eq('firebase_auth_id', user_id)
    .limit(1)

  if (!profileResult.data?.at(0) || profileResult.error) {
    console.error(profileResult.error + ' user:' + user_id)
    return Response.json({}, { status: 400, statusText: 'user not found' })
  }

  let result
  if (request.method === 'POST') {
    result = await client.from('subscribers').insert({
      content_type: params.contentType,
      content_id: Number(params.contentId),
      user_id: profileResult.data[0].id,
      tenant_id: process.env.TENANT_ID!,
    })
  } else {
    result = await client
      .from('subscribers')
      .delete()
      .eq('content_type', params.contentType)
      .eq('content_id', Number(params.contentId))
      .eq('user_id', profileResult.data[0].id)
      .eq('tenant_id', process.env.TENANT_ID!)
  }

  if (result.error) {
    console.error(result.error)
    return Response.json({}, { status: 500, statusText: 'error' })
  }

  return Response.json({}, { headers, status: 200 })
}
