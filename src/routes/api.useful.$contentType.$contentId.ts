import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { updateUserActivity } from 'src/utils/activity.server'

import type { LoaderFunctionArgs } from '@remix-run/node'

export async function action({ request, params }: LoaderFunctionArgs) {
  if (request.method !== 'POST' && request.method !== 'DELETE') {
    return Response.json({}, { status: 405, statusText: 'method not allowed' })
  }

  const { client, headers } = createSupabaseServerClient(request)
  const {
    data: { user },
  } = await client.auth.getUser()

  if (!user) {
    return Response.json(
      {},
      { headers, status: 401, statusText: 'unauthorized' },
    )
  }

  const profileResult = await client
    .from('profiles')
    .select()
    .eq('auth_id', user.id)
    .limit(1)

  if (!profileResult.data || profileResult.error) {
    console.error(profileResult.error + ' auth_id:' + user.id)
    return Response.json(
      {},
      { headers, status: 400, statusText: 'user not found' },
    )
  }

  let result
  if (request.method === 'POST') {
    result = await client.from('useful_votes').insert({
      content_type: params.contentType,
      content_id: Number(params.contentId),
      user_id: profileResult.data[0].id,
      tenant_id: process.env.TENANT_ID!,
    })
  } else {
    result = await client
      .from('useful_votes')
      .delete()
      .eq('content_type', params.contentType)
      .eq('content_id', Number(params.contentId))
      .eq('user_id', profileResult.data[0].id)
      .eq('tenant_id', process.env.TENANT_ID!)
  }

  if (result.error) {
    console.error(result.error)
    return Response.json({}, { headers, status: 500, statusText: 'error' })
  }

  updateUserActivity(client, user.id)

  return Response.json({}, { headers, status: 200 })
}
