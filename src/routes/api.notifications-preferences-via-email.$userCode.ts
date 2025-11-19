import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { tokens } from 'src/utils/tokens.server'

import { DEFAULT_NOTIFICATION_PREFERENCES } from './api.notifications-preferences'

import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router'

interface DecodedToken {
  profileId: string
  profileCreatedAt: string
}

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request)

  try {
    if (!params.userCode) {
      return Response.json(
        {},
        { headers, status: 401, statusText: 'unauthorized' },
      )
    }

    const decoded = tokens.verify(params.userCode) as DecodedToken
    const profileId = Number(decoded.profileId)

    const userData = await client
      .from('profiles')
      .select('id,is_contactable')
      .eq('id', profileId)
      .eq('created_at', decoded.profileCreatedAt)
      .maybeSingle()

    const userId = userData.data?.id as number
    if (!userId) {
      return Response.json(
        {},
        { headers, status: 401, statusText: 'unauthorized' },
      )
    }

    const preferencesData = await client
      .from('notifications_preferences')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    const is_contactable = userData.data?.is_contactable
    const preferences = preferencesData.data || DEFAULT_NOTIFICATION_PREFERENCES

    return Response.json(
      { preferences, is_contactable },
      { headers, status: 200 },
    )
  } catch (error) {
    console.error(error)
    return Response.json({ error }, { headers, status: 500 })
  }
}

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request)

  try {
    if (!params.userCode) {
      return Response.json(
        {},
        { headers, status: 401, statusText: 'unauthorized' },
      )
    }

    const decoded = tokens.verify(params.userCode) as DecodedToken
    const profileId = Number(decoded.profileId)

    const userData = await client
      .from('profiles')
      .select('id')
      .eq('id', profileId)
      .eq('created_at', decoded.profileCreatedAt)
      .maybeSingle()

    const userId = userData.data?.id as number

    if (!userId) {
      return Response.json(
        {},
        { headers, status: 401, statusText: 'unauthorized' },
      )
    }

    const { valid, status, statusText } = await validateRequest(request, userId)

    if (!valid) {
      return Response.json({}, { headers, status, statusText })
    }

    const formData = await request.formData()
    const existingPreferences = await client
      .from('notifications_preferences')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle()

    const existingPreferencesId = existingPreferences.data?.id || null
    const comments = formData.get('comments') === 'true'
    const replies = formData.get('replies') === 'true'
    const researchUpdates = formData.get('research_updates') === 'true'
    const isUnsubscribed = formData.get('is_unsubscribed') === 'true'

    if (existingPreferencesId) {
      await client
        .from('notifications_preferences')
        .update({
          comments,
          replies,
          research_updates: researchUpdates,
          is_unsubscribed: isUnsubscribed,
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
      is_unsubscribed: isUnsubscribed,
      tenant_id: process.env.TENANT_ID!,
    })

    return Response.json({}, { headers, status: 200 })
  } catch (error) {
    console.error(error)
    return Response.json({ error }, { headers, status: 500 })
  }
}

async function validateRequest(request: Request, userId: number) {
  if (!userId) {
    return { valid: false, status: 401, statusText: 'unauthorized' }
  }

  if (request.method !== 'POST') {
    return { valid: false, status: 405, statusText: 'Method not allowed' }
  }

  return { valid: true }
}
