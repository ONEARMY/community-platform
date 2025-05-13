import { Comment } from 'oa-shared'
import { transformNotification } from 'src/routes/api.notifications'

import type { SupabaseClient } from '@supabase/supabase-js'
import type { DBNotification, Profile } from 'oa-shared'

const createInstantNotificationEmail = async (
  client: SupabaseClient,
  dbNotification: DBNotification,
  userId: number,
) => {
  try {
    // Temporarily only for beta-testers
    const profileResponse = await client
      .from('profiles')
      .select('roles')
      .eq('id', userId)
      .single()

    const roles = profileResponse.data?.roles as Profile['roles']

    if (!roles?.includes('beta-tester')) {
      return
    }

    const rpcResponse = await client.rpc('get_user_email_by_profile_id', {
      id: userId,
    })

    const fullNotification = await transformNotification(dbNotification, client)

    if (fullNotification.parentContentId) {
      const parentContentType = 'comments'
      const parentContentResponse = await client
        .from(parentContentType)
        .select('*') // Added all for ease of typing - only really need the actual comment body
        .eq('id', fullNotification.parentContentId)
        .single()

      if (parentContentResponse.data) {
        const comment = Comment.fromDB(parentContentResponse.data)
        fullNotification.parentContent = comment
      }
    }

    await client.functions.invoke('send-email', {
      body: {
        user: {
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
    console.log(error)

    return Response.json(
      { error },
      { status: 500, statusText: 'Error creating email notification' },
    )
  }
}

export const notificationEmailService = {
  createInstantNotificationEmail,
}
