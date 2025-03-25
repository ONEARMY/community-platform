import type { SupabaseClient } from '@supabase/supabase-js'
import type { DBComment, NewNotificationData } from 'oa-shared'

const createNotificationNewComment = async (
  comment: DBComment,
  client: SupabaseClient,
) => {
  if (!comment.created_by) {
    return
  }

  const contentType = 'questions'

  const userToNotify = await client
    .from(contentType)
    .select('created_by')
    .eq('id', comment.source_id)
    .limit(1)

  if (userToNotify.data) {
    const notification: NewNotificationData = {
      actionType: 'new',
      contentType,
      ownedBy: userToNotify.data[0].created_by,
      sourceId: comment.id,
      triggeredBy: comment.created_by,
    }
    return createNotification(notification)
  }
}

const createNotification = (notification: NewNotificationData) => {
  const body = new FormData()

  body.append('actionType', notification.actionType)
  body.append('contentType', notification.contentType)
  body.append('ownedBy', notification.ownedBy.toString())
  body.append('sourceId', notification.sourceId.toString())
  body.append('triggeredBy', notification.triggeredBy.toString())

  return fetch('/api/notifications/', {
    method: 'POST',
    body,
  })
}

export const notificationsServiceSupabase = {
  createNotification,
  createNotificationNewComment,
}
