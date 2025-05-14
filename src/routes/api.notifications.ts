import { Notification } from 'oa-shared'
import { createSupabaseServerClient } from 'src/repository/supabase.server'

import type { LoaderFunctionArgs } from '@remix-run/node'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { DBNotification } from 'oa-shared'

const transformNotificationList = async (
  dbNotifications: DBNotification[],
  client: SupabaseClient,
) => {
  return Promise.all(
    dbNotifications.map(async (dbNotification) => {
      return await transformNotification(dbNotification, client)
    }),
  )
}

export const transformNotification = async (
  dbNotification: DBNotification,
  client: SupabaseClient,
) => {
  const contentTypes = {
    comment: 'comments',
    reply: 'comments',
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
  }

  const sourceContent = await client
    .from(notification.sourceContentType)
    .select('*')
    .eq('id', notification.sourceContentId)
    .single()

  if (sourceContent.data) {
    notification.sourceContent = sourceContent.data
  }

  return notification
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request)

  const {
    data: { user },
  } = await client.auth.getUser()

  if (!user) {
    return Response.json({}, { headers, status: 401 })
  }

  const profile = await client
    .from('profiles')
    .select('id')
    .eq('auth_id', user.id)
    .single()

  const response = await client
    .from('notifications')
    .select(
      `
      *,
      triggered_by:profiles!notifications_triggered_by_id_fkey(id,username)
    `,
    )
    .eq('owned_by_id', profile?.data?.id)

  const notifications = response.data?.length
    ? await transformNotificationList(response.data, client)
    : []

  return Response.json({ notifications }, { headers, status: 200 })
}
