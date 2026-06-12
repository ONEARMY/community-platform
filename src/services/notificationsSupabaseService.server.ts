import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  DBComment,
  DBNews,
  DBProfile,
  DBResearchItem,
  ProfileWithEmailAndPreferences,
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

  async getStaffProfiles(): Promise<ProfileWithEmailAndPreferences[]> {
    try {
      const response = await this.client.rpc('get_staff_profiles', {
        p_tenant_id: process.env.TENANT_ID!,
      });

      if (response.error) {
        throw response.error;
      }

      // Map old structure to new structure if needed
      const data = response.data ?? [];
      return data.map((profile: any) => {
        // Check if we got the old structure (with 'id' instead of 'profile_id')
        if ('id' in profile && !('profile_id' in profile)) {
          const prefs = profile.notifications_preferences?.[0] || {};
          return {
            profile_id: profile.id,
            profile_created_at: profile.created_at || new Date().toISOString(),
            display_name: profile.display_name,
            username: profile.username,
            roles: profile.roles || [],
            email: profile.email,
            comments: prefs.comments ?? true,
            replies: prefs.replies ?? true,
            research_updates: prefs.research_updates ?? true,
            is_unsubscribed: prefs.is_unsubscribed ?? false,
            content_reach: prefs.content_reach,
            badge_ids: [],
          } as ProfileWithEmailAndPreferences;
        }
        return profile;
      });
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  async getProfilesWithAnyBadge(): Promise<ProfileWithEmailAndPreferences[]> {
    try {
      const response = await this.client.rpc('get_profiles_with_any_badge', {
        p_tenant_id: process.env.TENANT_ID!,
      });

      if (response.error) {
        throw response.error;
      }

      // Map old structure to new structure if needed
      const data = response.data ?? [];
      return data.map((profile: any) => {
        // Check if we got the old structure (with 'id' instead of 'profile_id')
        if ('id' in profile && !('profile_id' in profile)) {
          const prefs = profile.notifications_preferences?.[0] || {};
          return {
            profile_id: profile.id,
            profile_created_at: profile.created_at || new Date().toISOString(),
            display_name: profile.display_name,
            username: profile.username,
            roles: profile.roles || [],
            email: profile.email,
            comments: prefs.comments ?? true,
            replies: prefs.replies ?? true,
            research_updates: prefs.research_updates ?? true,
            is_unsubscribed: prefs.is_unsubscribed ?? false,
            content_reach: prefs.content_reach,
            badge_ids: [],
          } as ProfileWithEmailAndPreferences;
        }
        return profile;
      });
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  async getProfilesByBadgeIds(badgeIds: number[]): Promise<ProfileWithEmailAndPreferences[]> {
    try {
      if (badgeIds.length === 0) {
        return [];
      }

      const response = await this.client.rpc('get_profiles_by_badge_ids', {
        p_badge_ids: badgeIds,
        p_tenant_id: process.env.TENANT_ID!,
      });

      if (response.error) {
        throw response.error;
      }

      // Map old structure to new structure if needed
      const data = response.data ?? [];
      return data.map((profile: any) => {
        // Check if we got the old structure (with 'id' instead of 'profile_id')
        if ('id' in profile && !('profile_id' in profile)) {
          const prefs = profile.notifications_preferences?.[0] || {};
          return {
            profile_id: profile.id,
            profile_created_at: profile.created_at || new Date().toISOString(),
            display_name: profile.display_name,
            username: profile.username,
            roles: profile.roles || [],
            email: profile.email,
            comments: prefs.comments ?? true,
            replies: prefs.replies ?? true,
            research_updates: prefs.research_updates ?? true,
            is_unsubscribed: prefs.is_unsubscribed ?? false,
            content_reach: prefs.content_reach,
            badge_ids: [],
          } as ProfileWithEmailAndPreferences;
        }
        return profile;
      });
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

  async createNotifications(notification: DBNotification, subscriberIds: number[]): Promise<void> {
    if (!subscriberIds || subscriberIds.length === 0) return;

    try {
      // Filter out any null or undefined subscriber IDs
      const validSubscriberIds = subscriberIds.filter((id) => id != null);

      if (validSubscriberIds.length === 0) return;

      const notificationsToInsert = validSubscriberIds.map(
        (subscriberId) =>
          new DBNotification({
            action_type: notification.action_type,
            content_id: notification.content_id,
            content_type: notification.content_type,
            source_content_id: notification.source_content_id,
            source_content_type: notification.source_content_type,
            title: notification.title,
            triggered_by_id: notification.triggered_by_id,
            owned_by_id: subscriberId,
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

      await this.createNotifications(
        dbNotification,
        subscribers.map((s) => s.profile_id),
      );

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

      const staffProfiles = await this.getStaffProfiles();

      // Build the pool of badge holders + staff (used for emails and, when badge-restricted, platform notifications)
      const badgeSubscribers =
        badgeIds.length > 0
          ? await this.getProfilesByBadgeIds(badgeIds)
          : await this.getProfilesWithAnyBadge();

      // Filter out any profiles without valid profile_id
      const validBadgeSubscribers = badgeSubscribers.filter((p) => p.profile_id != null);
      const validStaffProfiles = staffProfiles.filter((p) => p.profile_id != null);

      const notifyPool = new Map(validBadgeSubscribers.map((p) => [p.profile_id, p]));
      for (const staff of validStaffProfiles) {
        notifyPool.set(staff.profile_id, staff);
      }
      const emailSubscribersPool = Array.from(notifyPool.values());

      if (badgeIds.length === 0) {
        // No badge restrictions - platform notification goes to all users
        const allSubscribers = await this.getAllProfiles();
        const subscriberIds = allSubscribers?.map(({ id }) => id) || [];
        await this.createNotifications(dbNotification, subscriberIds);
      } else {
        // Badge restrictions - platform notification goes to badge holders + staff only
        await this.createNotifications(
          dbNotification,
          emailSubscribersPool.map((p) => p.profile_id).filter((id) => id != null),
        );
      }

      switch (news.content_reach) {
        case 'important': {
          // Send to users who opted into 'important' or 'all' emails
          const emailSubscribers = emailSubscribersPool.filter((subscriber) => {
            if (!subscriber.content_reach) {
              return true; // include by default
            }

            const reach = subscriber.content_reach;
            return reach === 'important' || reach === 'all';
          });

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
          const emailSubscribers = emailSubscribersPool.filter(
            (subscriber) => subscriber.content_reach === 'all',
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

      await this.createNotifications(
        dbNotification,
        subscribers.map((s) => s.profile_id),
      );

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
