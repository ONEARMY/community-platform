import { notificationEmailService } from './notificationEmailService.server'

import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  DBComment,
  DBResearchItem,
  DBResearchUpdate,
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

const getSubscribedUsers = async (
  contentId: number,
  contentType: SubscribableContentTypes,
  client: SupabaseClient,
): Promise<number[]> => {
  try {
    console.log('In getSubscribedUsers')
    const subscribedUsers = await client
      .from('subscribers')
      .select('user_id', { count: 'exact' })
      .eq('content_id', contentId)
      .eq('content_type', contentType)
    console.log({ subscribedUsers })
    if (!subscribedUsers.data) {
      return []
    }

    return [...new Set(subscribedUsers.data.map((user) => user.user_id))]
  } catch (error) {
    console.error(error)
    throw new Error(error)
  }
}

const createNotification = async (
  client: SupabaseClient,
  notification: NewNotificationData,
  profileId: number,
) => {
  try {
    console.log('In createNotification')
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
    console.log({ data })
    const response = await client.from('notifications').insert(data).select(`
      *,
      triggered_by:profiles!notifications_triggered_by_id_fkey(id,username)
    `)
    console.log({ response })
    if (response.error || !response.data) {
      throw response.error || 'No data returned'
    }

    await notificationEmailService.createInstantNotificationEmail(
      client,
      response.data[0],
      profileId,
    )
  } catch (error) {
    console.error(error)

    return Response.json(
      { error },
      {
        status: 500,
        statusText: `Error creating notification: ${notification.contentType}`,
      },
    )
  }
}

const createNotificationsNewComment = async (
  comment: DBComment,
  client: SupabaseClient,
) => {
  console.log('In createNotificationsNewComment')
  if (!comment.created_by) {
    return
  }

  try {
    const isReply = !!comment.parent_id
    const contentId = isReply ? comment.parent_id : comment.source_id
    console.log({
      isReply,
      contentId,
    })

    if (!contentId) {
      return new Error('contentId not found')
    }
    const contentType: SubscribableContentTypes = isReply
      ? 'comments'
      : comment.source_type
    console.log({ contentType })
    const subscribers = await getSubscribedUsers(contentId, contentType, client)
    console.log({ subscribers })
    subscribers.map(async (subscriberId: number) => {
      const isResearchUpdate = comment.source_type === 'research_update'
      const sourceContentId = await setSourceContentType(comment, client)

      const notification: NewNotificationData = {
        actionType: 'newComment' as NotificationActionType,
        ownedById: subscriberId!,
        contentId: comment.id!,
        sourceContentType: isResearchUpdate ? 'research' : comment.source_type!,
        sourceContentId: sourceContentId,
        parentContentId: isResearchUpdate ? comment.source_id! : null,
        triggeredById: comment.created_by!,
        contentType: isReply ? 'reply' : 'comment',
        parentCommentId: isReply ? comment.parent_id : null,
      }

      createNotification(client, notification, subscriberId!)
    })
  } catch (error) {
    console.error(error)

    return Response.json(
      { error },
      { status: 500, statusText: 'Error creating notifications: Comments' },
    )
  }
}

const createNotificationsResearchUpdate = async (
  research: DBResearchItem,
  researchUpdate: DBResearchUpdate,
  client: SupabaseClient,
) => {
  if (!researchUpdate.created_by) {
    return
  }

  try {
    const contentType: SubscribableContentTypes = 'research'

    const subscribers = await getSubscribedUsers(
      research.id,
      contentType,
      client,
    )

    subscribers.map(async (subscriberId: number) => {
      const notification: NewNotificationData = {
        actionType: 'newContent',
        ownedById: subscriberId!,
        contentId: researchUpdate.id!,
        sourceContentType: 'research',
        sourceContentId: research.id,
        parentContentId: researchUpdate.id,
        triggeredById: researchUpdate.created_by!,
        contentType: 'researchUpdate',
      }

      createNotification(client, notification, subscriberId!)
    })
  } catch (error) {
    console.error(error)

    return Response.json(
      { error },
      {
        status: 500,
        statusText: 'Error creating notifications: Research update',
      },
    )
  }
}

export const notificationsSupabaseServiceServer = {
  createNotificationsNewComment,
  createNotificationsResearchUpdate,
}
