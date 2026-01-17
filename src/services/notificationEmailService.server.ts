import { createElement } from 'react';
import { sendBatchEmails } from 'src/.server/resend';
import { InstantNotificationEmail } from 'src/.server/templates/instant-notification-email';
import { transformNotification } from 'src/routes/api.notifications';
import { tokens } from 'src/utils/tokens.server';

import { TenantSettingsService } from './tenantSettingsService.server';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { DBNotification } from 'oa-shared';

const sendInstantNotificationEmails = async (
  client: SupabaseClient,
  dbNotification: DBNotification,
  headers: Headers,
) => {
  try {
    const emailsToSend = await client.rpc('get_subscribed_users_emails_to_notify', {
      p_content_id: dbNotification.content_id,
      p_content_type: dbNotification.source_content_type,
      p_notification_content_type: dbNotification.content_type,
    });

    if (!emailsToSend.data || emailsToSend.data.length === 0) {
      throw emailsToSend.error || new Error('No emails to send');
    }

    const fullNotification = await transformNotification(dbNotification, client);
    const profiles: { profileId: number; userEmail: string; profileCreatedAt: string }[] =
      emailsToSend.data;

    const codes = profiles.map((p) => ({
      email: p.userEmail,
      code: tokens.generate(p.profileId, p.profileCreatedAt),
    }));

    const tenantSettings = await new TenantSettingsService(client).get();

    sendBatchEmails({
      from: '',
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
