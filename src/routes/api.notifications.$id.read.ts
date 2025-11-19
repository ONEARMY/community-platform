import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { updateUserActivity } from 'src/utils/activity.server'

import type { LoaderFunctionArgs, Params } from 'react-router'

export const action = async ({ params, request }: LoaderFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request)

  try {
    const claims = await client.auth.getClaims()

    if (!claims.data?.claims) {
      return Response.json({}, { headers, status: 401 })
    }

    const { valid, status, statusText } = await validateRequest(params, request)

    if (!valid) {
      return Response.json({}, { headers, status, statusText })
    }

    await client
      .from('notifications')
      .update({ is_read: true })
      .eq('id', params.id)

    updateUserActivity(client, claims.data.claims.sub)

    return Response.json({}, { headers, status: 200 })
  } catch (error) {
    console.error(error)
    return Response.json(
      {},
      {
        headers,
        status: 500,
        statusText: 'Error setting notification as read',
      },
    )
  }
}

async function validateRequest(params: Params<string>, request: Request) {
  if (request.method !== 'POST') {
    return { status: 405, statusText: 'method not allowed' }
  }

  if (!params.id) {
    return { status: 400, statusText: 'id is required' }
  }

  return { valid: true }
}
