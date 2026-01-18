import { createElement } from 'react';
import { sendBatchEmails } from 'src/.server/resend';
import { InstantNotificationEmail } from 'src/.server/templates/instant-notification-email';
import { transformNotification } from 'src/routes/api.notifications';
import { tokens } from 'src/utils/tokens.server';

import { TenantSettingsService } from './tenantSettingsService.server';

import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  DBNotification,
  NotificationContentType,
  NotificationsPreferenceTypes,
} from 'oa-shared';

const preferenceTypes: PreferenceTypes = {
  comment: 'comments',
  reply: 'comments',
  researchUpdate: 'research_updates',
};

type PreferenceTypes = {
  [type in NotificationContentType]: NotificationsPreferenceTypes;
};

const sendInstantNotificationEmails = async (
  client: SupabaseClient,
  contentId: number,
  dbNotification: DBNotification,
  headers: Headers,
) => {
  try {
    const subscribersToNotify = await client.rpc('get_subscribed_users_emails_to_notify', {
      p_content_id: contentId,
      p_content_type: preferenceTypes[dbNotification.content_type],
      p_notification_content_type: dbNotification.source_content_type,
    });

    if (subscribersToNotify.error || subscribersToNotify.data.length === 0) {
      throw subscribersToNotify.error || new Error('No emails to send');
    }

    const emailsToSend = subscribersToNotify.data.filter(
      (emailObj) => emailObj.profile_id !== dbNotification.triggered_by_id,
    );

    if (emailsToSend.length === 0) {
      throw new Error('No emails to send');
    }

    const fullNotification = await transformNotification(dbNotification, client);
    const profiles: { profile_id: number; email: string; profile_created_at: string }[] =
      emailsToSend;

    const codes = profiles.map((p) => ({
      email: p.email,
      code: tokens.generate(p.profile_id, p.profile_created_at),
    }));

    const tenantSettings = await new TenantSettingsService(client).get();

    sendBatchEmails({
      from: tenantSettings.emailFrom,
      subject: 'You have a new notification',
      emails: codes.map(({ code, email }) => {
        return {
          to: email,
          template: createElement(InstantNotificationEmail, {
            notification: fullNotification,
            userCode: code,
            settings: tenantSettings,
          }),
        };
      }),
    });
  } catch (error) {
    console.error('Error creating email notification:', error);
    return Response.json(error, {
      headers,
      status: 500,
      statusText: error.statusText,
    });
  }
};

export const notificationEmailService = {
  sendInstantNotificationEmails,
};
