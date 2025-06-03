import { createSupabaseServerClient } from 'src/repository/supabase.server'

import type { User } from '@supabase/supabase-js'

export const DEFAULT_NOTIFICATION_PREFERENCES = {
  comments: true,
  replies: true,
}

export const loader = async ({ request }) => {
  const { client, headers } = createSupabaseServerClient(request)
  const {
    data: { user },
  } = await client.auth.getUser()

  if (!user) {
    return Response.json({}, { status: 401, statusText: 'unauthorized' })
  }

  const { data } = await client
    .from('notifications_preferences')
    .select('*, profiles!inner(id)')
    .eq('profiles.auth_id', user.id)
    .single()

  const preferences = data || DEFAULT_NOTIFICATION_PREFERENCES

  return Response.json({ preferences }, { headers, status: 200 })
}

export const action = async ({ request }) => {
  const { client, headers } = createSupabaseServerClient(request)

  try {
    const formData = await request.formData()
    const id = formData.has('id') ? Number(formData.get('id') as string) : null
    const comments = formData.get('comments') === 'true'
    const replies = formData.get('replies') === 'true'

    const {
      data: { user },
    } = await client.auth.getUser()

    const { valid, status, statusText } = await validateRequest(request, user)

    if (!valid) {
      return Response.json({}, { status, statusText })
    }

    if (id) {
      await client
        .from('notifications_preferences')
        .update({
          comments,
          replies,
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
      return Response.json({}, { status: 401, statusText: 'User not found' })
    }

    await client
      .from('notifications_preferences')
      .insert({
        user_id: data.id,
        comments,
        replies,
      })
      .select()

    return Response.json({}, { headers, status: 200 })
  } catch (error) {
    return Response.json({ error }, { headers, status: 500 })
  }
}

async function validateRequest(request: Request, user: User | null) {
  if (!user) {
    return { status: 401, statusText: 'Unauthorized' }
  }

  if (request.method !== 'POST') {
    return { status: 405, statusText: 'Method not allowed' }
  }

  return { valid: true }
}
