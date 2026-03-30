import type { SupabaseClient } from '@supabase/supabase-js';
import type { DBNotification, SubscribedUser } from 'oa-shared';
import { createElement } from 'react';
import { sendBatchEmails } from 'src/.server/resend';
import { InstantNotificationEmail } from 'src/.server/templates/instant-notification-email';
import { tokens } from 'src/utils/tokens.server';
import { NotificationMapperServiceServer } from './notificationMapperService.server';
import { TenantSettingsService } from './tenantSettingsService.server';

export class NotificationEmailServiceServer {
  constructor(private client: SupabaseClient) {}

  async sendInstantNotificationEmails(
    subscribers: SubscribedUser[],
    dbNotification: DBNotification,
  ) {
    try {
      const emailsToSend = subscribers.filter((result) => {
        if (result.profile_id === dbNotification.triggered_by_id) {
          return false;
        }

        if (result.is_unsubscribed) {
          return false;
        }

        if (result.replies === false && dbNotification.action_type === 'newReply') {
          return false;
        }

        if (result.comments === false && dbNotification.action_type === 'newComment') {
          return false;
        }

        if (
          result.research_updates === false &&
          dbNotification.action_type === 'newContent' &&
          dbNotification.content_type === 'research_updates'
        ) {
          return false;
        }

        if (
          result.email.endsWith('@example.com') ||
          result.email.endsWith('@test.com') ||
          result.email.endsWith('@resend.dev')
        ) {
          return false;
        }

        return true;
      });

      if (emailsToSend.length === 0) {
        throw new Error('No emails to send');
      }

      const fullNotification = await new NotificationMapperServiceServer(
        this.client,
      ).transformNotification(dbNotification);

      const codes = emailsToSend.map((p) => ({
        email: p.email,
        code: tokens.generate(p.profile_id, p.profile_created_at),
      }));

      const tenantSettings = await new TenantSettingsService(this.client).get();

      const emails = codes.map(({ code, email }) => {
        return {
          to: email,
          template: createElement(InstantNotificationEmail, {
            notification: fullNotification,
            userCode: code,
            settings: tenantSettings,
          }),
        };
      });

      sendBatchEmails({
        from: tenantSettings.emailFrom,
        subject: fullNotification.email.subject,
        emails,
      });
    } catch (error) {
      console.error('Error creating email notification:', error);
    }
  }
}
