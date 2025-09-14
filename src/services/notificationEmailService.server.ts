import { transformNotification } from 'src/routes/api.notifications'
import { tokens } from 'src/utils/tokens.server'

import type { SupabaseClient } from '@supabase/supabase-js'
import type { DBNotification } from 'oa-shared'

const createInstantNotificationEmail = async (
  client: SupabaseClient,
  dbNotification: DBNotification,
  profileId: number,
  headers: Headers,
) => {
  try {
    const profileResponse = await client
      .from('profiles')
      .select('created_at')
      .eq('id', profileId)
      .single()

    if (!profileResponse.data) {
      console.error('Profile not found for ID:', profileId)
      return
    }

    const rpcResponse = await client.rpc('get_user_email_by_profile_id', {
      id: profileId,
    })

    if (!rpcResponse.data || rpcResponse.data.length === 0) {
      const error = `No email found for profile ID: ${profileId}`
      console.error(error)
      throw error
    }

    const userEmail = rpcResponse.data[0]?.email
    if (!userEmail) {
      console.error('Email is missing for profile ID:', profileId)
      return
    }

    const fullNotification = await transformNotification(dbNotification, client)
    const code = tokens.generate(profileId, profileResponse.data.created_at)

    return await client.functions.invoke('send-email', {
      body: {
        user: {
          code,
          email: userEmail,
        },
        email_data: {
          email_action_type: 'instant_notification',
          notification: fullNotification,
        },
      },
    })
  } catch (error) {
    console.error('Error creating email notification:', error)
    return Response.json(error, {
      headers,
      status: 500,
      statusText: error.statusText,
    })
  }
}

export const notificationEmailService = {
  createInstantNotificationEmail,
}
