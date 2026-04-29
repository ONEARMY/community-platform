import {
  type DBEmailContentReach,
  DBNotificationsPreferences,
  NotificationsPreferences,
} from 'oa-shared';
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { EmailContentReachServiceServer } from 'src/services/emailContentReachService.server';
import { methodNotAllowedError, unauthorizedError, validationError } from 'src/utils/httpException';
import { tokens } from 'src/utils/tokens.server';
import { setDefaultNotifications } from './api.notifications-preferences';

interface DecodedToken {
  profileId: string;
  profileCreatedAt: string;
}

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    if (!params.userCode) {
      throw unauthorizedError();
    }

    const decoded = tokens.verify(params.userCode) as DecodedToken;
    const profileId = Number(decoded.profileId);

    const userData = await client
      .from('profiles')
      .select('id,is_contactable')
      .eq('id', profileId)
      .eq('created_at', decoded.profileCreatedAt)
      .maybeSingle();

    const userId = userData.data?.id as number;
    if (!userId) {
      throw unauthorizedError();
    }

    const emailContentReachServiceServer = new EmailContentReachServiceServer(client);
    const dbDefaultEmailContentReach = await emailContentReachServiceServer.getDefault();
    const defaultDBPreferences = setDefaultNotifications(
      dbDefaultEmailContentReach as DBEmailContentReach,
    );

    const { data } = await client
      .from('notifications_preferences')
      .select('*,email_content_reach:email_content_reach(*)')
      .eq('user_id', userId)
      .maybeSingle();

    const isContactable = !!userData.data?.is_contactable;
    const preferences: NotificationsPreferences = NotificationsPreferences.fromDB({
      ...defaultDBPreferences,
      ...(data as DBNotificationsPreferences),
    });

    return Response.json({ preferences, isContactable }, { headers, status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error }, { headers, status: 500 });
  }
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    if (!params.userCode) {
      throw unauthorizedError();
    }

    const decoded = tokens.verify(params.userCode) as DecodedToken;
    const profileId = Number(decoded.profileId);

    const userData = await client
      .from('profiles')
      .select('id')
      .eq('id', profileId)
      .eq('created_at', decoded.profileCreatedAt)
      .maybeSingle();
    const userId = userData.data?.id as number;

    await validateRequest(request, userId);

    const formData = await request.formData();
    const existingPreferences = await client
      .from('notifications_preferences')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    const existingPreferencesId = existingPreferences.data?.id || null;
    const comments = formData.get('comments') === 'true';
    const emailContentReach = formData.get('emailContentReach');
    const replies = formData.get('replies') === 'true';
    const researchUpdates = formData.get('researchUpdates') === 'true';
    const isUnsubscribed = formData.get('isUnsubscribed') === 'true';

    if (existingPreferencesId) {
      await client
        .from('notifications_preferences')
        .update({
          comments,
          email_content_reach: emailContentReach,
          replies,
          research_updates: researchUpdates,
          is_unsubscribed: isUnsubscribed,
        })
        .eq('id', existingPreferencesId)
        .select();
      return Response.json({}, { headers, status: 200 });
    }

    await client.from('notifications_preferences').insert({
      user_id: userId,
      comments,
      email_content_reach: emailContentReach,
      replies,
      research_updates: researchUpdates,
      is_unsubscribed: isUnsubscribed,
      tenant_id: process.env.TENANT_ID!,
    });

    return Response.json({}, { headers, status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error }, { headers, status: 500 });
  }
};

async function validateRequest(request: Request, userId: number) {
  if (!userId) {
    throw validationError('User not found');
  }

  if (request.method !== 'POST') {
    return methodNotAllowedError();
  }

  return { valid: true };
}
