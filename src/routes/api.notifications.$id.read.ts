import { createSupabaseServerClient } from 'src/repository/supabase.server'

import type { LoaderFunctionArgs } from '@remix-run/node'
import type { Params } from '@remix-run/react'
import type { User } from '@supabase/supabase-js'

export const action = async ({ params, request }: LoaderFunctionArgs) => {
  try {
    const { client, headers } = createSupabaseServerClient(request)

    const {
      data: { user },
    } = await client.auth.getUser()

    const { valid, status, statusText } = await validateRequest(
      params,
      request,
      user,
    )

    if (!valid) {
      return Response.json({}, { status, statusText })
    }

    await client
      .from('notifications')
      .update({ is_read: true })
      .eq('id', params.id)

    return Response.json({}, { headers, status: 200 })
  } catch (error) {
    console.error(error)
    return Response.json(
      {},
      { status: 500, statusText: 'Error setting notification as read' },
    )
  }
}

async function validateRequest(
  params: Params<string>,
  request: Request,
  user: User | null,
) {
  if (!user) {
    return { status: 401, statusText: 'unauthorized' }
  }

  if (request.method !== 'POST') {
    return { status: 405, statusText: 'method not allowed' }
  }

  if (!params.id) {
    return { status: 400, statusText: 'id is required' }
  }

  return { valid: true }
}
