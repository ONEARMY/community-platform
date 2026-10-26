import {
  ContentReach,
  DBNotificationsPreferences,
  NotificationsPreferences,
  NotificationsPreferencesDefaults,
} from 'oa-shared';
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { logger } from 'src/logger';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { methodNotAllowedError, unauthorizedError, validationError } from 'src/utils/httpException';
import { tokens } from 'src/utils/tokens.server';

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
      .select('id,is_contactable,roles')
      .eq('id', profileId)
      .eq('created_at', decoded.profileCreatedAt)
      .maybeSingle();

    const userId = userData.data?.id as number;
    if (!userId) {
      throw unauthorizedError();
    }

    const { data } = await client
      .from('notifications_preferences')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    const isContactable = !!userData.data?.is_contactable;
    const roles = userData.data?.roles || [];
    const preferences: NotificationsPreferences = NotificationsPreferences.fromDB({
      ...NotificationsPreferencesDefaults,
      ...(data as DBNotificationsPreferences),
    });

    return Response.json({ preferences, isContactable, roles }, { headers, status: 200 });
  } catch (error) {
    logger.error(error);
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
    const preferences =
      formData.get('List-Unsubscribe') === 'One-Click'
        ? { is_unsubscribed: true }
        : {
            comments: formData.get('comments') === 'true',
            content_reach: formData.get('contentReach') as ContentReach,
            replies: formData.get('replies') === 'true',
            research_updates: formData.get('researchUpdates') === 'true',
            is_unsubscribed: formData.get('isUnsubscribed') === 'true',
          };

    await client.from('notifications_preferences').upsert(
      {
        ...NotificationsPreferencesDefaults,
        ...preferences,
        user_id: userId,
        tenant_id: process.env.TENANT_ID!,
      },
      { onConflict: 'user_id' },
    );

    return Response.json({}, { headers, status: 200 });
  } catch (error) {
    logger.error(error);
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
