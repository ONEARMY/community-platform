import type { SupabaseClient } from '@supabase/supabase-js';
import type { DBNotification, NotificationDisplay, SubscribedUser } from 'oa-shared';
import { createElement } from 'react';
import { sendBatchEmails } from 'src/.server/resend';
import { InstantNotificationEmail } from 'src/.server/templates/instant-notification-email';
import { NewsEmail } from 'src/.server/templates/news-email';
import { tokens } from 'src/utils/tokens.server';
import { NotificationMapperServiceServer } from './notificationMapperService.server';
import { TenantSettingsService } from './tenantSettingsService.server';

type Previewer = {
  email: string;
  profileId: number;
  createdAt: string;
};

interface SendInstantNotificationEmailsProps {
  emailSubscribers: SubscribedUser[];
  dbNotification: DBNotification;
  requestOrigin: string;
  isNews?: boolean;
  excludeTriggerer?: boolean;
}

export class NotificationEmailServiceServer {
  constructor(private client: SupabaseClient) {
    Object.assign(this);
  }

  subscribersToEmail(
    emailSubscribers: SubscribedUser[],
    dbNotification: DBNotification,
    excludeTriggerer: boolean,
  ) {
    console.log('[DEBUG FILTER] Starting to filter', emailSubscribers.length, 'subscribers');
    console.log('[DEBUG FILTER] Notification type:', dbNotification.action_type);

    const filtered = emailSubscribers.filter((result, index) => {
      const reasons: string[] = [];

      if (excludeTriggerer && result.profile_id === dbNotification.triggered_by_id) {
        reasons.push('is triggerer');
        if (index === 0) console.log('[DEBUG FILTER] Sample reject - triggerer:', result.email);
        return false;
      }

      if (result.is_unsubscribed) {
        reasons.push('is unsubscribed');
        if (index === 0) console.log('[DEBUG FILTER] Sample reject - unsubscribed:', result.email);
        return false;
      }

      if (result.replies === false && dbNotification.action_type === 'newReply') {
        reasons.push('replies disabled');
        if (index === 0)
          console.log('[DEBUG FILTER] Sample reject - replies disabled:', result.email);
        return false;
      }

      if (result.comments === false && dbNotification.action_type === 'newComment') {
        reasons.push('comments disabled');
        if (index === 0)
          console.log('[DEBUG FILTER] Sample reject - comments disabled:', result.email);
        return false;
      }

      if (
        result.research_updates === false &&
        dbNotification.action_type === 'newContent' &&
        dbNotification.content_type === 'research_updates'
      ) {
        reasons.push('research updates disabled');
        if (index === 0)
          console.log('[DEBUG FILTER] Sample reject - research updates disabled:', result.email);
        return false;
      }

      if (
        result.email.endsWith('@example.com') ||
        result.email.endsWith('@test.com') ||
        result.email.endsWith('@resend.dev')
      ) {
        reasons.push('test email');
        if (index === 0) console.log('[DEBUG FILTER] Sample reject - test email:', result.email);
        return false;
      }

      if (index === 0) console.log('[DEBUG FILTER] Sample PASS:', result.email);
      return true;
    });

    console.log('[DEBUG FILTER] Filtered from', emailSubscribers.length, 'to', filtered.length);
    return filtered;
  }

  async sendNewsPreview(
    previewer: Previewer,
    notification: NotificationDisplay,
    requestOrigin: string,
  ) {
    const tenantSettings = await new TenantSettingsService(this.client, requestOrigin).get();

    try {
      const codes = {
        email: previewer.email,
        code: tokens.generate(previewer.profileId, previewer.createdAt),
      };

      const email = {
        to: codes.email,
        template: createElement(NewsEmail, {
          notification,
          userCode: codes.code,
          settings: tenantSettings,
          isPreview: true,
        }),
      };

      sendBatchEmails({
        from: `${tenantSettings.messageSignOff} <${tenantSettings.emailFrom}>`,
        subject: notification.email.subject,
        emails: [email],
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async sendInstantNotificationEmails(props: SendInstantNotificationEmailsProps) {
    const { emailSubscribers, dbNotification, isNews = false, excludeTriggerer = true } = props;
    const emailTemplate = isNews ? NewsEmail : InstantNotificationEmail;

    console.log('[DEBUG EMAIL] Received email subscribers count:', emailSubscribers.length);
    console.log('[DEBUG EMAIL] Sample subscriber:', emailSubscribers[0]);
    console.log('[DEBUG EMAIL] Is news:', isNews, 'Exclude triggerer:', excludeTriggerer);

    try {
      const emailsToSend = this.subscribersToEmail(
        emailSubscribers,
        dbNotification,
        excludeTriggerer,
      );

      console.log('[DEBUG EMAIL] Emails to send after filtering:', emailsToSend.length);
      console.log('[DEBUG EMAIL] Sample email to send:', emailsToSend[0]);

      if (emailsToSend.length === 0) {
        console.log('[DEBUG EMAIL] No emails to send - exiting');
        return;
      }

      const fullNotification = await new NotificationMapperServiceServer(
        this.client,
      ).transformNotification(dbNotification);

      const codes = emailsToSend.map((p) => ({
        email: p.email,
        code: tokens.generate(p.profile_id, p.profile_created_at),
      }));

      const tenantSettings = await new TenantSettingsService(
        this.client,
        props.requestOrigin,
      ).get();

      const emails = codes.map(({ code, email }) => {
        return {
          to: email,
          template: createElement(emailTemplate, {
            notification: fullNotification,
            userCode: code,
            settings: tenantSettings,
          }),
        };
      });

      console.log('[DEBUG EMAIL] About to send batch emails');
      console.log('[DEBUG EMAIL] Batch email count:', emails.length);
      console.log('[DEBUG EMAIL] Sample email recipient:', emails[0]?.to);
      console.log('[DEBUG EMAIL] Subject:', fullNotification.email.subject);
      console.log(
        '[DEBUG EMAIL] From:',
        `${tenantSettings.messageSignOff} <${tenantSettings.emailFrom}>`,
      );

      sendBatchEmails({
        from: `${tenantSettings.messageSignOff} <${tenantSettings.emailFrom}>`,
        subject: fullNotification.email.subject,
        emails,
      });

      console.log('[DEBUG EMAIL] sendBatchEmails called successfully');
    } catch (error) {
      console.error('Error creating email notification:', error);
    }
  }
}
