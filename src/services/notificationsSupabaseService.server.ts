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

  async getAllProfiles() {
    // Currently simplified to direct client request (and not a function) as not emailing all users yet
    try {
      const response = await this.client.from('profiles').select(`id`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  async getProfilesByBadgeId(badgeId: number) {
    try {
      const response = await this.client.rpc('get_profiles_by_badge', {
        p_badge_id: badgeId,
      });
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  async getSubscribedUsers(
    contentId: number,
    contentType: SubscribableContentTypes,
  ): Promise<SubscribedUser[]> {
    try {
      let data;

      const response = await this.client.rpc('get_subscribed_users_emails_to_notify', {
        p_content_id: contentId,
        p_content_type: contentType,
      });
      data = response.data;

      return data as SubscribedUser[];
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  async createNotifications(
    notification: DBNotification,
    subscriberIds: Partial<SubscribedUser>[],
  ): Promise<void> {
    if (!subscriberIds) return;

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
            owned_by_id: subscriber.profile_id!,
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

      const dbNotification = new DBNotification({
        action_type: isReply ? 'newReply' : 'newComment',
        content_id: comment.id!,
        title: title,
        triggered_by_id: comment.created_by!,
        triggered_by: (comment as any).profiles as DBProfile,
        content_type: 'comments',
      });

      await this.createNotifications(dbNotification, subscribers);

      await new NotificationEmailServiceServer(this.client).sendInstantNotificationEmails({
        emailSubscribers: subscribers,
        dbNotification,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async createNotificationsNews(news: DBNews) {
    try {
      const contentId = news.id;

      const dbNotification = new DBNotification({
        action_type: 'newNews',
        content_id: contentId,
        title: news.title,
        triggered_by_id: news.created_by!,
        content_type: 'news',
      });

      if (!news.profile_badge) {
        const allSubscribers = await this.getAllProfiles();
        const subscriberIds = allSubscribers?.map(({ id }) => ({ profile_id: id })) || [];
        await this.createNotifications(dbNotification, subscriberIds);
      }

      if (news.profile_badge) {
        const badgeSubscribers = await this.getProfilesByBadgeId(news.profile_badge.id);
        await this.createNotifications(dbNotification, badgeSubscribers);

        switch (news.email_content_reach?.name) {
          case 'important': {
            // Exclude the no email people
            const emailSubscribers = badgeSubscribers.filter(
              (subscriber) =>
                subscriber.notification_preferences?.email_content_reach?.name !== 'none',
            );
            await new NotificationEmailServiceServer(this.client).sendInstantNotificationEmails({
              emailSubscribers,
              dbNotification,
              isNews: true,
              excludeTriggerer: false,
            });
            return;
          }
          case 'all': {
            // Include only the all email people
            const emailSubscribers = badgeSubscribers.filter(
              (subscriber) =>
                subscriber.notification_preferences?.email_content_reach?.name === 'all' ||
                subscriber.roles.includes('admin'),
            );
            await new NotificationEmailServiceServer(this.client).sendInstantNotificationEmails({
              emailSubscribers,
              dbNotification,
              isNews: true,
              excludeTriggerer: false,
            });
            return;
          }
          default: {
            return;
          }
        }
      }
      return;
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
      const dbNotification = new DBNotification({
        action_type: 'newContent',
        title: research.title,
        content_id: researchUpdate.id!,
        content_type: 'research_updates',
        triggered_by_id: profile.id,
        triggered_by: profile,
      });

      await this.createNotifications(dbNotification, subscribers);

      await new NotificationEmailServiceServer(this.client).sendInstantNotificationEmails({
        emailSubscribers: subscribers,
        dbNotification,
        excludeTriggerer: false,
      });
    } catch (error) {
      console.error(error);
    }
  }
}
