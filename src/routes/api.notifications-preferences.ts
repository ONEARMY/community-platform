import { createSupabaseServerClient } from 'src/repository/supabase.server'

import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import type { User } from '@supabase/supabase-js'
import type { DBNotificationsPreferencesFields } from 'oa-shared'

export const DEFAULT_NOTIFICATION_PREFERENCES: DBNotificationsPreferencesFields =
  {
    comments: true,
    replies: true,
    research_updates: true,
    is_unsubscribed: false,
  }

export const loader = async ({ request }: LoaderFunctionArgs) => {
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

  const { data } = await client
    .from('notifications_preferences')
    .select('*, profiles!inner(id)')
    .eq('profiles.auth_id', user.id)
    .single()

  const preferences = data || DEFAULT_NOTIFICATION_PREFERENCES

  return Response.json({ preferences }, { headers, status: 200 })
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request)

  try {
    const formData = await request.formData()
    const id = formData.has('id') ? Number(formData.get('id') as string) : null
    const comments = formData.get('comments') === 'true'
    const replies = formData.get('replies') === 'true'
    const research_updates = formData.get('research_updates') === 'true'
    const is_unsubscribed = formData.get('is_unsubscribed') === 'true'

    const {
      data: { user },
    } = await client.auth.getUser()

    const { valid, status, statusText } = await validateRequest(request, user)

    if (!valid) {
      return Response.json({}, { headers, status, statusText })
    }

    if (id) {
      await client
        .from('notifications_preferences')
        .update({
          comments,
          replies,
          research_updates,
          is_unsubscribed,
        })
        .eq('id', id)
        .select()

      return Response.json({}, { headers, status: 200 })
    }

    const { data, error } = await client
      .from('profiles')
      .select('id, auth_id')
      .eq('auth_id', user?.id)
      .single()

    if (!data) {
      console.error(error)
      return Response.json(
        {},
        { headers, status: 401, statusText: 'User not found' },
      )
    }

    await client.from('notifications_preferences').insert({
      user_id: data.id,
      comments,
      replies,
      research_updates,
      is_unsubscribed,
      tenant_id: process.env.TENANT_ID!,
    })

    return Response.json({}, { headers, status: 200 })
  } catch (error) {
    console.error('Action error:', error)
    return Response.json({ error }, { headers, status: 500 })
  }
}

async function validateRequest(request: Request, user: User | null) {
  if (!user) {
    return { valid: false, status: 401, statusText: 'Unauthorized' }
  }

  if (request.method !== 'POST') {
    return { valid: false, status: 405, statusText: 'Method not allowed' }
  }

  return { valid: true }
}
