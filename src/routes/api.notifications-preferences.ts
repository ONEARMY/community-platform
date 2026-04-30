import { HTTPException } from 'hono/http-exception';
import type { DBNotificationsPreferencesDefaults } from 'oa-shared';
import { NotificationsPreferences } from 'oa-shared';
import { type ActionFunctionArgs, data, type LoaderFunctionArgs } from 'react-router';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { EmailContentReachServiceServer } from 'src/services/emailContentReachService.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { methodNotAllowedError, unauthorizedError } from 'src/utils/httpException';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    const claims = await client.auth.getClaims();

    if (!claims.data?.claims) {
      throw unauthorizedError();
    }

    const emailContentReachServiceServer = new EmailContentReachServiceServer(client);
    const dbDefaultEmailContentReach = await emailContentReachServiceServer.getDefault();
    const defaultDBPreferences = setDefaultNotifications(dbDefaultEmailContentReach);

    const preferencesData = await client
      .from('notifications_preferences')
      .select('*,profiles!inner(id)')
      .eq('profiles.auth_id', claims.data?.claims?.sub)
      .single();

    const preferences = NotificationsPreferences.fromDB({
      ...defaultDBPreferences,
      ...preferencesData.data,
    });

    return data({ preferences }, { headers, status: 200 });
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    console.error(error);
    return Response.json({ error: 'Error loading preferences' }, { status: 500, headers });
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    const formData = await request.formData();
    const comments = formData.get('comments') === 'true';
    const email_content_reach = Number(formData.get('emailContentReach')) || null;
    const is_unsubscribed = formData.get('isUnsubscribed') === 'true';
    const replies = formData.get('replies') === 'true';
    const research_updates = formData.get('researchUpdates') === 'true';

    const claims = await client.auth.getClaims();

    if (!claims.data?.claims) {
      throw unauthorizedError();
    }

    await validateRequest(request);

    const profile = await client
      .from('profiles')
      .select('id')
      .eq('auth_id', claims.data.claims.sub)
      .single();

    if (!profile.data) {
      console.error(profile.error);
      throw unauthorizedError();
    }

    const existingPreferences = await client
      .from('notifications_preferences')
      .select('id')
      .eq('user_id', profile.data.id)
      .single();

    const result = existingPreferences.data
      ? await client
          .from('notifications_preferences')
          .update({
            comments,
            replies,
            research_updates,
            is_unsubscribed,
            email_content_reach,
          })
          .eq('user_id', profile.data.id)
      : await client.from('notifications_preferences').insert({
          user_id: profile.data.id,
          comments,
          replies,
          research_updates,
          is_unsubscribed,
          email_content_reach,
          tenant_id: process.env.TENANT_ID!,
        });

    if (result.error) {
      throw new Error(result.error?.code + ': ' + result.error?.message + result.error?.details);
    }

    new ProfileServiceServer(client).updateUserActivity(claims.data.claims.sub);

    return data({}, { headers, status: 200 });
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    console.error(error);
    return Response.json({ error: 'Error updating preferences' }, { headers, status: 500 });
  }
};

async function validateRequest(request: Request) {
  if (request.method !== 'POST') {
    throw methodNotAllowedError();
  }
}

export const setDefaultNotifications = (
  dbDefaultEmailContentReach: number | null,
): DBNotificationsPreferencesDefaults => {
  return {
    comments: true,
    email_content_reach: dbDefaultEmailContentReach,
    is_unsubscribed: false,
    replies: true,
    research_updates: true,
  };
};
