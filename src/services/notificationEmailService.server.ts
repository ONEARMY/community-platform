import { createElement } from 'react';
import { sendBatchEmails } from 'src/.server/resend';
import { InstantNotificationEmail } from 'src/.server/templates/instant-notification-email';
import { transformNotification } from 'src/routes/api.notifications';
import { tokens } from 'src/utils/tokens.server';

import { TenantSettingsService } from './tenantSettingsService.server';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { DBNotification, SubscribedUser } from 'oa-shared';

const sendInstantNotificationEmails = async (
  client: SupabaseClient,
  subscribers: SubscribedUser[],
  dbNotification: DBNotification,
  headers: Headers,
) => {
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

      return true;
    });

    if (emailsToSend.length === 0) {
      throw new Error('No emails to send');
    }

    const fullNotification = await transformNotification(dbNotification, client);

    const codes = emailsToSend.map((p) => ({
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
