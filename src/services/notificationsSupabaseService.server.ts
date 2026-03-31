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
import { NotificationEmailServiceServer } from './notificationEmailService.server';

export class NotificationsSupabaseServiceServer {
  constructor(private client: SupabaseClient) {}

  async getSubscribedUsers(
    contentId: number,
    contentType: SubscribableContentTypes,
  ): Promise<SubscribedUser[]> {
    try {
      let data;

      if (contentType === 'news') {
        const response = await this.client.from('profiles').select(
          `id,
          roles,
          badges:profile_badges_relations(
            profile_badges(id)
          )
          `,
        );
        data =
          response.data &&
          response.data.map(({ id, roles, badges }) => ({
            badge_ids: badges
              ? badges
                  .map(({ profile_badges }) => profile_badges)
                  .flat()
                  .map((badge) => badge.id)
              : [],
            profile_id: id,
            roles,
          }));
      } else {
        const response = await this.client.rpc('get_subscribed_users_emails_to_notify', {
          p_content_id: contentId,
          p_content_type: contentType,
        });
        data = response.data;
      }

      return data as SubscribedUser[];
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  async createNotifications(
    notification: DBNotification,
    subscriberIds: SubscribedUser[],
  ): Promise<void> {
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

      const response = await this.client.from('notifications').insert(notificationsToInsert);

      if (response.error) {
        throw response.error;
      }
    } catch (error) {
      console.error(error);
    }

    return;
  }

  async createNotificationsNewComment(comment: DBComment) {
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
        const sourceItem = await this.client
          .from(comment.source_type)
          .select('title')
          .eq('id', comment.source_id)
          .single();
        title = sourceItem.data?.title;
      }

      const subscribers = (await this.getSubscribedUsers(contentId, contentType)).filter(
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

      await this.createNotifications(notification, subscribers);

      await new NotificationEmailServiceServer(this.client).sendInstantNotificationEmails(
        subscribers,
        notification,
      );
    } catch (error) {
      console.error(error);
    }
  }

  async createNotificationsNews(news: DBNews) {
    try {
      const contentId = news.id;

      let subscribers = await this.getSubscribedUsers(contentId, 'news');
      if (news.profile_badge) {
        subscribers = subscribers.filter(
          (subscriber) =>
            subscriber.badge_ids.includes(news.profile_badge as unknown as number) ||
            (subscriber.roles && subscriber.roles.includes('admin')),
        );
      }

      const notification = new DBNotification({
        action_type: 'newNews',
        content_id: contentId,
        title: news.title,
        triggered_by_id: news.created_by!,
        content_type: 'news',
      });

      await this.createNotifications(notification, subscribers);
    } catch (error) {
      console.error(error);
    }
  }

  async createNotificationsResearchUpdate(
    research: DBResearchItem,
    researchUpdate: ResearchUpdate,
    profile: DBProfile,
  ) {
    try {
      const contentType: SubscribableContentTypes = 'research';
      const subscribers = await this.getSubscribedUsers(research.id, contentType);
      const notification = new DBNotification({
        action_type: 'newContent',
        title: research.title,
        content_id: researchUpdate.id!,
        content_type: 'research_updates',
        triggered_by_id: profile.id,
        triggered_by: profile,
      });

      await this.createNotifications(notification, subscribers);

      await new NotificationEmailServiceServer(this.client).sendInstantNotificationEmails(
        subscribers,
        notification,
      );
    } catch (error) {
      console.error(error);
    }
  }
}
