import type { SupabaseClient } from '@supabase/supabase-js';
import type { Moderation } from 'oa-shared';
import { createElement } from 'react';
import { sendEmail } from 'src/.server/resend';
import { OrganisationApplicationEmail } from 'src/.server/templates/organisation-application-email';
import { createSupabaseAdminServerClient } from 'src/repository/supabaseAdmin.server';

import { TenantSettingsService } from './tenantSettingsService.server';

const SUBJECTS: Record<Moderation, string> = {
  'awaiting-moderation': 'Your organisation application is in',
  accepted: "You're in! Your organisation profile is approved",
  'improvements-needed': 'Almost there — your organisation profile needs a few changes',
  rejected: 'About your organisation application',
};

type SendArgs = {
  authId: string | null;
  client: SupabaseClient;
  feedback: string | null;
  moderation: Moderation;
  requestOrigin: string;
  username: string | null;
};

export async function sendModerationEmail({
  authId,
  client,
  feedback,
  moderation,
  requestOrigin,
  username,
}: SendArgs): Promise<boolean> {
  const subject = SUBJECTS[moderation];

  if (!authId || !username) {
    return false;
  }

  try {
    const { data: user, error: userError } =
      await createSupabaseAdminServerClient().auth.admin.getUserById(authId);

    if (userError || !user?.user?.email) {
      console.error('Could not resolve an email address for the applicant', userError);
      return false;
    }

    const settings = await new TenantSettingsService(client, requestOrigin).get();
    const siteUrl = settings.siteUrl;

    const { error } = await sendEmail({
      from: `${settings.messageSignOff} <${settings.emailFrom}>`,
      to: user.user.email,
      subject,
      emailTemplate: createElement(OrganisationApplicationEmail, {
        contactEmail: settings.emailFrom,
        feedback,
        moderation,
        profileUrl: `${siteUrl}/u/${username}`,
        settings,
        settingsUrl: `${siteUrl}/settings/profile`,
        username,
      }),
    });

    if (error) {
      console.error('Failed to send organisation application email', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(
      'Failed to send organisation application email:',
      error instanceof Error ? error.message : error,
    );
    return false;
  }
}
