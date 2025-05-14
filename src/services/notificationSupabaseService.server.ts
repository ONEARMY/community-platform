import { notificationEmailService } from './notificationEmailService.server'

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
      const isReply = !!comment.parent_id
      const notification: NewNotificationData = {
        actionType: 'newComment' as NotificationActionType,
        ownedById: subscriber.user_id!,
        contentId: comment.id!,
        sourceContentType: comment.source_type!,
        sourceContentId: comment.source_id!,
        triggeredById: comment.created_by!,
        contentType: isReply ? 'reply' : 'comment',
        ...(comment.parent_id ? { parentContentId: comment.parent_id } : {}),
      }

      createNotification(client, notification, subscriber.user_id!)
    })
  }
}

const createNotification = async (
  client: SupabaseClient,
  notification: NewNotificationData,
  userId: number,
) => {
  try {
    const data = {
      action_type: notification.actionType,
      content_type: notification.contentType,
      content_id: notification.contentId,
      owned_by_id: notification.ownedById,
      source_content_type: notification.sourceContentType,
      source_content_id: notification.sourceContentId,
      triggered_by_id: notification.triggeredById,
      is_read: false,
      tenant_id: process.env.TENANT_ID!,
      ...(notification.parentContentId
        ? { parent_content_id: notification.parentContentId }
        : {}),
    }

    const response = await client.from('notifications').insert(data).select(`
      *,
      triggered_by:profiles!notifications_triggered_by_id_fkey(id,username)
    `)

    if (response.error || !response.data) {
      throw response.error || 'No data returned'
    }

    await notificationEmailService.createInstantNotificationEmail(
      client,
      response.data[0],
      userId,
    )
  } catch (error) {
    console.log(error)

    return Response.json(
      { error },
      { status: 500, statusText: 'Error creating notification' },
    )
  }
}

export const notificationsSupabaseServiceServer = {
  createNotification,
  createNotificationNewComment,
}
