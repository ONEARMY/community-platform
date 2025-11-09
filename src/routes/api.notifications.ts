import { Notification, NotificationDisplay } from 'oa-shared'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { resolveType } from 'src/utils/contentType.utils'

import type { LoaderFunctionArgs } from '@remix-run/node'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { DBNotification } from 'oa-shared'

const transformNotificationList = async (
  dbNotifications: DBNotification[],
  client: SupabaseClient,
) => {
  return Promise.allSettled(
    dbNotifications.map((dbNotification) =>
      transformNotification(dbNotification, client),
    ),
  ).then((results) => {
    return results
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value)
  })
}

export const transformNotification = async (
  dbNotification: DBNotification,
  client: SupabaseClient,
) => {
  try {
    const contentTypes = {
      comment: 'comments',
      reply: 'comments',
      researchUpdate: 'research_updates',
    }

    const notification = Notification.fromDB(dbNotification)
    const contentType = contentTypes[notification.contentType]

    const content = await client
      .from(contentType)
      .select('*')
      .eq('id', notification.contentId)
      .single()

    if (content.data) {
      notification.content = content.data
    } else {
      throw Error('Comment not found, probably deleted')
    }

    const sourceContentType = resolveType(notification.sourceContentType)
    const sourceContent = await client
      .from(sourceContentType)
      .select('*')
      .eq('id', notification.sourceContentId)
      .single()

    notification.sourceContent = sourceContent.data

    if (notification.parentCommentId) {
      const parentComment = await client
        .from('comments')
        .select('*')
        .eq('id', notification.parentCommentId)
        .single()
      notification.parentComment = parentComment.data
    }

    if (notification.parentContentId) {
      const parentContent = await client
        .from('research_updates')
        .select('*')
        .eq('id', notification.parentContentId)
        .single()
      notification.parentContent = parentContent.data
    }

    return NotificationDisplay.fromNotification(notification)
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request)

  try {
    const claims = await client.auth.getClaims()

    if (!claims.data?.claims) {
      return Response.json({}, { headers, status: 401 })
    }

    const profileResponse = await client
      .from('profiles')
      .select('id')
      .eq('auth_id', claims.data.claims.sub)
      .maybeSingle() // Maybe single due to dup profiles in tests

    if (!profileResponse.data || profileResponse.error) {
      throw profileResponse.error || 'No user found'
    }

    const { data, error } = await client
      .from('notifications')
      .select(
        `
      *,
      triggered_by:profiles!notifications_triggered_by_id_fkey(id,username)
    `,
      )
      .eq('owned_by_id', profileResponse?.data?.id)

    if (error) {
      throw error
    }

    const notifications = data?.length
      ? await transformNotificationList(data, client)
      : []

    return Response.json({ notifications }, { headers, status: 200 })
  } catch (error) {
    console.error(error)
    return Response.json({ error }, { headers, status: 500 })
  }
}
