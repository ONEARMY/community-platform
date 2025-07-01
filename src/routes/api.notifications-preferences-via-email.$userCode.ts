import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { tokens } from 'src/utils/tokens.server'

import type { ActionFunctionArgs } from '@remix-run/node'

export const DEFAULT_NOTIFICATION_PREFERENCES = {
  comments: true,
  replies: true,
  research_updates: true,
}

export const loader = async ({ params, request }) => {
  const { client, headers } = createSupabaseServerClient(request)
  try {
    if (!params.userCode) {
      return Response.json({}, { status: 401, statusText: 'unauthorized' })
    }

    const decoded = tokens.verify(params.userCode)

    const userData = await client
      .from('profiles')
      .select('id')
      .eq('id', decoded['profileId'])
      .eq('created_at', decoded['profileCreatedAt'])
      .single()

    const userId = userData.data?.id

    if (!userId) {
      return Response.json({}, { status: 401, statusText: 'unauthorized' })
    }

    const preferencesData = await client
      .from('notifications_preferences')
      .select('*')
      .eq('user_id', userId)
      .single()

    const preferences = preferencesData.data || DEFAULT_NOTIFICATION_PREFERENCES

    return Response.json({ preferences }, { headers, status: 200 })
  } catch (error) {
    return Response.json({ error }, { headers, status: 500 })
  }
}

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request)

  try {
    if (!params.userCode) {
      return Response.json({}, { status: 401, statusText: 'unauthorized' })
    }

    const decoded = tokens.verify(params.userCode)

    const userData = await client
      .from('profiles')
      .select('id')
      .eq('id', decoded['profileId'])
      .eq('created_at', decoded['profileCreatedAt'])
      .single()

    const userId = userData.data?.id

    if (!userId) {
      return Response.json({}, { status: 401, statusText: 'unauthorized' })
    }

    const formData = await request.formData()

    const existingPreferences = await client
      .from('notifications_preferences')
      .select('id')
      .eq('user_id', userId)
      .single()

    const existingPreferencesId = existingPreferences.data?.id || null
    const comments = formData.get('comments') === 'true'
    const replies = formData.get('replies') === 'true'
    const researchUpdates = formData.get('research_updates') === 'true'

    const { valid, status, statusText } = await validateRequest(request)

    if (!valid) {
      return Response.json({}, { status, statusText })
    }

    if (existingPreferencesId) {
      await client
        .from('notifications_preferences')
        .update({
          comments,
          replies,
          research_updates: researchUpdates,
        })
        .eq('id', existingPreferencesId)
        .select()

      return Response.json({}, { headers, status: 200 })
    }

    await client.from('notifications_preferences').insert({
      user_id: userId,
      comments,
      replies,
      research_updates: researchUpdates,
      tenant_id: process.env.TENANT_ID!,
    })

    return Response.json({}, { headers, status: 200 })
  } catch (error) {
    return Response.json({ error }, { headers, status: 500 })
  }
}

async function validateRequest(request: Request) {
  if (request.method !== 'POST') {
    return { status: 405, statusText: 'Method not allowed' }
  }

  return { valid: true }
}
