import { notificationEmailService } from './notificationEmailService.server'

import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  DBComment,
  DBSubscriber,
  NewNotificationData,
  NotificationActionType,
  SubscribableContentTypes,
} from 'oa-shared'

const setSourceContentType = async (
  comment: DBComment,
  client: SupabaseClient,
) => {
  if (!(comment.source_type === 'research_update')) {
    return comment.source_id
  }
  const researchUpdate = await client
    .from('research_updates')
    .select('research_id')
    .eq('id', comment.source_id)
    .single()

  return researchUpdate.data?.research_id
}

const createNotificationNewComment = async (
  comment: DBComment,
  client: SupabaseClient,
) => {
  if (!comment.created_by) {
    return
  }

  try {
    const isReply = !!comment.parent_id
    const contentId = isReply ? comment.parent_id : comment.source_id
    const contentType: SubscribableContentTypes = isReply
      ? 'comments'
      : comment.source_type

    const subscribedUsers = await client
      .from('subscribers')
      .select('user_id')
      .eq('content_id', contentId)
      .eq('content_type', contentType)

    if (!subscribedUsers.data) {
      return
    }

    subscribedUsers.data.map(async (subscriber: Partial<DBSubscriber>) => {
      const isResearchUpdate = comment.source_type === 'research_update'
      const sourceContentId = await setSourceContentType(comment, client)

      const notification: NewNotificationData = {
        actionType: 'newComment' as NotificationActionType,
        ownedById: subscriber.user_id!,
        contentId: comment.id!,
        sourceContentType: isResearchUpdate ? 'research' : comment.source_type!,
        sourceContentId: sourceContentId,
        parentContentId: isResearchUpdate ? comment.source_id! : null,
        triggeredById: comment.created_by!,
        contentType: isReply ? 'reply' : 'comment',
        parentCommentId: isReply ? comment.parent_id : null,
      }

      createNotification(client, notification, subscriber.user_id!)
    })
  } catch (error) {
    console.log(error)

    return Response.json(
      { error },
      { status: 500, statusText: 'Error creating notification' },
    )
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
      parent_content_id: notification.parentContentId,
      parent_comment_id: notification.parentCommentId,
      is_read: false,
      tenant_id: process.env.TENANT_ID!,
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
  createNotificationNewComment,
}
