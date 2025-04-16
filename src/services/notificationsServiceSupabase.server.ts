import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  DBComment,
  DBSubscriber,
  NewNotificationData,
  NotificationActionType,
} from 'oa-shared'

const createNotificationNewComment = async (
  comment: DBComment,
  client: SupabaseClient,
) => {
  if (!comment.created_by) {
    return
  }

  const subscribedUsers = await client
    .from('subscribers')
    .select('user_id')
    .eq('content_id', comment.source_id)
    .eq('content_type', comment.source_type)

  if (subscribedUsers.data) {
    subscribedUsers.data.map((subscriber: Partial<DBSubscriber>) => {
      const notificationBase = {
        actionType: 'newComment' as NotificationActionType,
        ownedById: subscriber.user_id!,
        sourceContentType: comment.source_type!,
        sourceContentId: comment.source_id!,
        triggeredById: comment.created_by!,
      }

      const isReply = !!comment.parent_id

      if (isReply) {
        const notification: NewNotificationData = {
          ...notificationBase,
          contentType: 'reply',
          parentContentType: 'comment',
          parentContentId: comment.parent_id,
        }

        return createNotification(client, notification)
      }

      const notification: NewNotificationData = {
        ...notificationBase,
        contentType: 'comment',
      }
      createNotification(client, notification)
    })
  }
}

const createNotification = async (
  client: SupabaseClient,
  notification: NewNotificationData,
) => {
  try {
    const data = {
      action_type: notification.actionType,
      content_type: notification.contentType,
      owned_by_id: notification.ownedById,
      source_content_type: notification.sourceContentType,
      source_content_id: notification.sourceContentId,
      triggered_by_id: notification.triggeredById,
      read: false,
      tenant_id: process.env.TENANT_ID!,
      ...(notification.parentContentType
        ? { parent_content_type: notification.parentContentType }
        : {}),
      ...(notification.parentContentId
        ? { parent_content_id: notification.parentContentId }
        : {}),
    }

    const response = await client.from('notifications').insert(data).select()

    if (response.error || !response.data) {
      throw response.error || 'No data returned'
    }

    return
  } catch (error) {
    console.log(error)

    return Response.json(
      { error },
      { status: 500, statusText: 'Error creating notification' },
    )
  }
}

export const notificationsServiceSupabaseServer = {
  createNotification,
  createNotificationNewComment,
}
