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
    // Temporarily only for beta-testers
    const profileResponse = await client
      .from('profiles')
      .select('created_at,roles')
      .eq('id', profileId)
      .single()

    const roles = profileResponse.data?.roles as Profile['roles']

    if (!roles?.includes('beta-tester')) {
      return
    }

    const shouldEmail = await shouldSendEmail(client, dbNotification, profileId)

    if (!shouldEmail) {
      return
    }

    const rpcResponse = await client.rpc('get_user_email_by_profile_id', {
      id: profileId,
    })

    const fullNotification = await transformNotification(dbNotification, client)

    const code = tokens.generate(profileId, profileResponse.data?.created_at)

    await client.functions.invoke('send-email', {
      body: {
        user: {
          code,
          email: rpcResponse.data[0].email,
        },
        email_data: {
          email_action_type: 'instant_notification',
          notification: fullNotification,
        },
      },
    })
    return
  } catch (error) {
    console.error(error)

    return Response.json(
      { error },
      { status: 500, statusText: 'Error creating email notification' },
    )
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

  if ((preferences as DBNotificationsPreferences).is_unsubscribed) {
    return false
  }

  if (preferences) {
    return preferences[actionType]
  }

  return DEFAULT_NOTIFICATION_PREFERENCES[actionType]
}

export const notificationEmailService = {
  createInstantNotificationEmail,
}
