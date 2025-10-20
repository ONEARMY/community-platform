import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { updateUserActivity } from 'src/utils/activity.server'

import type { LoaderFunctionArgs } from '@remix-run/node'
import type { User } from '@supabase/supabase-js'

export const action = async ({ request }: LoaderFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request)

  try {
    const {
      data: { user },
    } = await client.auth.getUser()

    const { valid, status, statusText } = await validateRequest(request, user)

    if (!valid) {
      return Response.json({}, { headers, status, statusText })
    }

    const profile = await client
      .from('profiles')
      .select('id')
      .eq('auth_id', user?.id)
      .single()

    await client
      .from('notifications')
      .update({ is_read: true })
      .eq('owned_by_id', profile?.data?.id)

    updateUserActivity(client, user!.id)

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

async function validateRequest(request: Request, user: User | null) {
  if (!user) {
    return { status: 401, statusText: 'unauthorized' }
  }

  if (request.method !== 'POST') {
    return { status: 405, statusText: 'method not allowed' }
  }

  return { valid: true }
}
