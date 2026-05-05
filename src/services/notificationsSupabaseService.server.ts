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

  async getProfilesWithAnyBadge() {
    try {
      const response = await this.client
        .from('profile_badges_relations')
        .select(
          `
          profile_id,
          profiles!inner (
            id,
            display_name,
            username,
            email,
            roles,
            notification_preferences
          )
        `,
        )
        .or('roles.cs.{admin,editor,moderator}');

      if (response.error) {
        throw response.error;
      }

      const uniqueProfiles = new Map(
        response.data
          ?.filter((item: any) => item.profiles)
          .map((item: any) => [item.profiles.id, item.profiles]),
      );

      return Array.from(uniqueProfiles.values());
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  async getProfilesByBadgeIds(badgeIds: number[]) {
    try {
      if (badgeIds.length === 0) {
        return [];
      }

      // Get all profiles that have ANY of the specified badges
      const response = await this.client
        .from('profile_badges_relations')
        .select(
          `
          profile_id,
          profiles!inner (
            id,
            display_name,
            username,
            email,
            roles,
            notification_preferences
          )
        `,
        )
        .in('profile_badge_id', badgeIds)
        .or('roles.cs.{admin,editor,moderator}');

      if (response.error) {
        throw response.error;
      }

      // Deduplicate profiles (in case a user has multiple badges)
      const uniqueProfiles = new Map(
        response.data
          ?.filter((item: any) => item.profiles)
          .map((item: any) => [item.profiles.id, item.profiles]),
      );

      return Array.from(uniqueProfiles.values());
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

  async createNotificationsNewComment(comment: DBComment, requestOrigin: string) {
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
        requestOrigin,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async createNotificationsNews(news: DBNews, requestOrigin: string) {
    try {
      const contentId = news.id;

      const dbNotification = new DBNotification({
        action_type: 'newNews',
        content_id: contentId,
        title: news.title,
        triggered_by_id: news.created_by!,
        content_type: 'news',
      });

      const badgeIds = news.profile_badges?.map((pb) => pb.profile_badges.id) || [];

      let badgeSubscribers: any[] = [];

      if (badgeIds.length === 0) {
        // No badge restrictions - notify all (website only, no email)
        const allSubscribers = await this.getAllProfiles();
        const subscriberIds = allSubscribers?.map(({ id }) => ({ profile_id: id })) || [];
        await this.createNotifications(dbNotification, subscriberIds);

        badgeSubscribers = await this.getProfilesWithAnyBadge();
      } else {
        // Badge restrictions - notify users with ANY of the required badges
        badgeSubscribers = await this.getProfilesByBadgeIds(badgeIds);
        await this.createNotifications(dbNotification, badgeSubscribers);
      }

      switch (news.content_reach) {
        case 'important': {
          // Exclude the no email people
          const emailSubscribers = badgeSubscribers.filter(
            (subscriber) => subscriber.notification_preferences?.content_reach !== null,
          );
          await new NotificationEmailServiceServer(this.client).sendInstantNotificationEmails({
            emailSubscribers,
            dbNotification,
            isNews: true,
            excludeTriggerer: false,
            requestOrigin,
          });
          break;
        }
        case 'all': {
          // Include only the all email people
          const emailSubscribers = badgeSubscribers.filter(
            (subscriber) => subscriber.notification_preferences?.content_reach === 'all',
          );
          await new NotificationEmailServiceServer(this.client).sendInstantNotificationEmails({
            emailSubscribers,
            dbNotification,
            isNews: true,
            excludeTriggerer: false,
            requestOrigin,
          });
          break;
        }
        default: {
          break;
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  async createNotificationsResearchUpdate(
    research: DBResearchItem,
    researchUpdate: ResearchUpdate,
    profile: DBProfile,
    requestOrigin: string,
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
        requestOrigin,
      });
    } catch (error) {
      console.error(error);
    }
  }
}
