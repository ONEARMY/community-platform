import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  DBComment,
  DBNews,
  DBProfile,
  DBResearchItem,
  ResearchUpdate,
  SubscribableContentTypes,
  SubscribedUser,
} from 'oa-shared';
import { DBNotification } from 'oa-shared';
import { notificationEmailService } from './notificationEmailService.server';

const getSubscribedUsers = async (
  contentId: number,
  contentType: SubscribableContentTypes,
  client: SupabaseClient,
): Promise<SubscribedUser[]> => {
  try {
    let data
    let error

    if (contentType === "news") {
      const response = await client.from('profiles').select('id')
        data = response.data && response.data.map(({id}) => ({ profile_id: id }))
        error = response.error
    } else {
      const response = await client.rpc('get_subscribed_users_emails_to_notify', {
        p_content_id: contentId,
        p_content_type: contentType,
      });
      data = response.data
      error = response.error
    }

    if (error || data.length === 0) {
      throw error || new Error('No emails to send');
    }

    return data as SubscribedUser[];
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

const createNotifications = async (
  client: SupabaseClient,
  notification: DBNotification,
  subscriberIds: SubscribedUser[],
): Promise<void> => {
  try {
    const notificationsToInsert = subscriberIds.map(
      (subscriber) =>
        new DBNotification({
          action_type: notification.action_type,
          content_id: notification.content_id,
          content_type: notification.content_type,
          source_content_id: notification.source_content_id,
          source_content_type: notification.source_content_type,
          title: notification.title,
          triggered_by_id: notification.triggered_by_id,
          owned_by_id: subscriber.profile_id,
          is_read: false,
          tenant_id: process.env.TENANT_ID!,
        }),
    );

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

    let title = '';
    if (!isReply) {
      const sourceItem = await client
        .from(comment.source_type)
        .select('title')
        .eq('id', comment.source_id)
        .single();
      title = sourceItem.data?.title;
    }

    const subscribers = (await getSubscribedUsers(contentId, contentType, client)).filter(
      (user) => user.profile_id !== comment.created_by,
    );

    const notification = new DBNotification({
      action_type: isReply ? 'newReply' : 'newComment',
      content_id: comment.id!,
      title: title,
      triggered_by_id: comment.created_by!,
      triggered_by: (comment as any).profiles as DBProfile,
      content_type: 'comments',
    });

    await createNotifications(client, notification, subscribers);

    await notificationEmailService.sendInstantNotificationEmails(
      client,
      subscribers,
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

const createNotificationsNews = async (
  news: DBNews,
  client: SupabaseClient,
  headers: Headers,
) => {
  try {
    const contentId = news.id
    const contentType: SubscribableContentTypes = 'news';

    const subscribers = (await getSubscribedUsers(contentId, contentType, client))

    const notification = new DBNotification({
      action_type: 'news',
      content_id: contentId,
      title: news.title,
      triggered_by_id: news.created_by!,
      content_type: 'news',
    });

    await createNotifications(client, notification, subscribers);

  } catch (error) {
    console.error(error);

    return Response.json(
      { error },
      {
        headers,
        status: 500,
        statusText: 'Error creating notifications: News',
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
      title: research.title,
      content_id: researchUpdate.id!,
      content_type: 'research_updates',
      triggered_by_id: profile.id,
      triggered_by: profile,
    });

    await createNotifications(client, notification, subscribers);

    await notificationEmailService.sendInstantNotificationEmails(
      client,
      subscribers,
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
  createNotificationsNews,
  createNotificationsResearchUpdate,
};
