import { DBNotification } from 'oa-shared';

import { notificationEmailService } from './notificationEmailService.server';

import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  DBComment,
  DBProfile,
  DBResearchItem,
  ResearchUpdate,
  SubscribableContentTypes,
} from 'oa-shared';

const setSourceContentType = async (comment: DBComment, client: SupabaseClient) => {
  if (comment.source_type !== 'research_update') {
    return comment.source_id;
  }
  const researchUpdate = await client
    .from('research_updates')
    .select('research_id')
    .eq('id', comment.source_id)
    .single();

  return researchUpdate.data?.research_id;
};

const getSubscribedUsers = async (
  contentId: number,
  contentType: SubscribableContentTypes,
  client: SupabaseClient,
): Promise<number[]> => {
  try {
    const subscribedUsers = await client
      .from('subscribers')
      .select('user_id')
      .eq('content_id', contentId)
      .eq('content_type', contentType);

    if (!subscribedUsers.data || subscribedUsers.data.length === 0) {
      return [];
    }

    return [...new Set(subscribedUsers.data.map((user) => user.user_id))];
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

const createNotifications = async (
  client: SupabaseClient,
  notification: DBNotification,
  subscriberIds: number[],
): Promise<void> => {
  try {
    const notificationsToInsert = subscriberIds.map((subscriberId) => {
      new DBNotification({
        ...notification,
        owned_by_id: subscriberId,
        is_read: false,
        tenant_id: process.env.TENANT_ID!,
      });
    });

    const response = await client.from('notifications').insert(notificationsToInsert);

    if (response.error) {
      throw response.error;
    }
  } catch (error) {
    console.error(error);
  }

  return;
};

const createNotificationsNewComment = async (
  comment: DBComment,
  client: SupabaseClient,
  headers: Headers,
) => {
  if (!comment.created_by) {
    return;
  }

  try {
    const isReply = !!comment.parent_id;
    const contentId = isReply ? comment.parent_id : comment.source_id;

    if (!contentId) {
      return new Error('contentId not found');
    }
    const contentType: SubscribableContentTypes = isReply ? 'comments' : comment.source_type;

    const subscriberIds = (await getSubscribedUsers(contentId, contentType, client)).filter(
      (id) => id !== comment.created_by,
    );

    const isResearchUpdate = comment.source_type === 'research_update';
    const sourceContentId = await setSourceContentType(comment, client);

    const notification = new DBNotification({
      action_type: 'newComment',
      content_id: comment.id!,
      source_content_type: comment.source_type!,
      source_content_id: sourceContentId,
      parent_content_id: isResearchUpdate ? comment.source_id! : null,
      triggered_by_id: comment.created_by!,
      triggered_by: (comment as any).profiles as DBProfile,
      content_type: isReply ? 'reply' : 'comment',
      parent_comment_id: isReply ? comment.parent_id : null,
    });

    await createNotifications(client, notification, subscriberIds);

    await notificationEmailService.sendInstantNotificationEmails(
      client,
      isReply ? comment.parent_id! : comment.source_id!,
      notification,
      headers,
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      { error },
      {
        headers,
        status: 500,
        statusText: 'Error creating notifications: Comments',
      },
    );
  }
};

const createNotificationsResearchUpdate = async (
  research: DBResearchItem,
  researchUpdate: ResearchUpdate,
  profile: DBProfile,
  client: SupabaseClient,
  headers: Headers,
) => {
  try {
    const contentType: SubscribableContentTypes = 'research';
    const subscribers = await getSubscribedUsers(research.id, contentType, client);
    const notification = new DBNotification({
      action_type: 'newContent',
      content_id: researchUpdate.id!,
      source_content_type: 'research',
      source_content_id: research.id,
      parent_content_id: researchUpdate.id,
      content_type: 'researchUpdate',
      triggered_by_id: profile.id,
      triggered_by: profile,
    });

    await createNotifications(client, notification, subscribers);

    await notificationEmailService.sendInstantNotificationEmails(
      client,
      researchUpdate.id,
      notification,
      headers,
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      { error },
      {
        headers,
        status: 500,
        statusText: 'Error creating notifications: Research update',
      },
    );
  }
};

export const notificationsSupabaseServiceServer = {
  createNotificationsNewComment,
  createNotificationsResearchUpdate,
};
