import { transformNotification } from 'src/routes/api.notifications'
import { DEFAULT_NOTIFICATION_PREFERENCES } from 'src/routes/api.notifications-preferences'
import { tokens } from 'src/utils/tokens.server'

import { notificationsPreferencesServiceServer } from './notificationsPreferencesService.server'

import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  DBNotification,
  DBNotificationsPreferences,
  NotificationContentType,
  NotificationsPreferenceTypes,
  Profile,
} from 'oa-shared'

const preferenceTypes: PreferenceTypes = {
  comment: 'comments',
  reply: 'replies',
  researchUpdate: 'research_updates',
}

type PreferenceTypes = {
  [type in NotificationContentType]: NotificationsPreferenceTypes
}

const createInstantNotificationEmail = async (
  client: SupabaseClient,
  dbNotification: DBNotification,
  profileId: number,
) => {
  try {
    console.log('In createInstantNotificationEmail')
    // Temporarily only for admins, beta-testers, research_creators
    const profileResponse = await client
      .from('profiles')
      .select('created_at,roles')
      .eq('id', profileId)
      .single()

    if (!profileResponse.data) {
      console.error('Profile not found for ID:', profileId)
      return
    }

    const roles = profileResponse.data.roles as Profile['roles']
    console.log({ roles })
    const approvedRoles = ['admin', 'beta-tester', 'research_creator']
    const hasPlatformRole = !!roles?.every((role) =>
      approvedRoles.includes(role),
    )

    if (!hasPlatformRole) {
      return
    }

    const shouldEmail = await shouldSendEmail(client, dbNotification, profileId)
    if (!shouldEmail) {
      return
    }

    const rpcResponse = await client.rpc('get_user_email_by_profile_id', {
      id: profileId,
    })
    console.log({ rpcResponse })
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
    console.log({ fullNotification })
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
    return Response.json(error, { status: 500, statusText: error.statusText })
  }
}

const shouldSendEmail = async (
  client: SupabaseClient,
  dbNotification: DBNotification,
  profileId: number,
): Promise<boolean> => {
  const actionType = preferenceTypes[dbNotification.content_type]
  if (!actionType) {
    return false
  }

  const preferences =
    await notificationsPreferencesServiceServer.getPreferences(
      client,
      profileId,
    )

  if (!preferences) {
    return DEFAULT_NOTIFICATION_PREFERENCES[actionType]
  }

  const userPreferences = preferences as DBNotificationsPreferences

  if (userPreferences.is_unsubscribed) {
    return false
  }

  return (
    userPreferences[actionType] ?? DEFAULT_NOTIFICATION_PREFERENCES[actionType]
  )
}

export const notificationEmailService = {
  createInstantNotificationEmail,
}
