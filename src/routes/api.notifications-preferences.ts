import type { DBNotificationsPreferencesDefaults, EmailContentReach } from 'oa-shared';
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { emailContentReachServiceServer } from 'src/services/emailContentReachService.server';
import { ProfileServiceServer } from 'src/services/profileService.server';

export const setDefaultNotifications = (
  defaultEmailContentReach: EmailContentReach,
): DBNotificationsPreferencesDefaults => {
  return {
    comments: true,
    email_content_reach: defaultEmailContentReach.id,
    is_unsubscribed: false,
    replies: true,
    research_updates: true,
  };
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);

  const claims = await client.auth.getClaims();

  if (!claims.data?.claims) {
    return Response.json({}, { headers, status: 401, statusText: 'unauthorized' });
  }
  const { data } = await client
    .from('notifications_preferences')
    .select('*,profiles!inner(id),email_content_reach:email_content_reach(*)')
    .eq('profiles.auth_id', claims.data?.claims?.sub)
    .single();

  if (data) {
    return Response.json({ preferences: data }, { headers, status: 200 });
  }

  const emailContentReach = await emailContentReachServiceServer.getDefault(client);
  if (emailContentReach) {
    const preferences = setDefaultNotifications(emailContentReach);
    return Response.json({ preferences }, { headers, status: 200 });
  }

  return Response.json({}, { headers, status: 500, statusText: 'Error loading preferences' });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    const formData = await request.formData();
    const id = formData.has('id') ? Number(formData.get('id') as string) : null;
    const comments = formData.get('comments') === 'true';
    const email_content_reach = null;
    const is_unsubscribed = formData.get('is_unsubscribed') === 'true';
    const replies = formData.get('replies') === 'true';
    const research_updates = formData.get('research_updates') === 'true';

    const claims = await client.auth.getClaims();

    if (!claims.data?.claims) {
      return Response.json({}, { headers, status: 401 });
    }

    const { valid, status, statusText } = await validateRequest(request);

    if (!valid) {
      return Response.json({}, { headers, status, statusText });
    }

    if (id) {
      await client
        .from('notifications_preferences')
        .update({
          comments,
          replies,
          research_updates,
          is_unsubscribed,
          email_content_reach,
        })
        .eq('id', id)
        .select();

      return Response.json({}, { headers, status: 200 });
    }

    const { data, error } = await client
      .from('profiles')
      .select('id, auth_id')
      .eq('auth_id', claims.data.claims.sub)
      .single();

    if (!data) {
      console.error(error);
      return Response.json({}, { headers, status: 401, statusText: 'User not found' });
    }

    await client.from('notifications_preferences').insert({
      user_id: data.id,
      comments,
      replies,
      research_updates,
      is_unsubscribed,
      email_content_reach,
      tenant_id: process.env.TENANT_ID!,
    });

    new ProfileServiceServer(client).updateUserActivity(claims.data.claims.sub);

    return Response.json({}, { headers, status: 200 });
  } catch (error) {
    console.error('Action error:', error);
    return Response.json({ error }, { headers, status: 500 });
  }
};

async function validateRequest(request: Request) {
  if (request.method !== 'POST') {
    return { valid: false, status: 405, statusText: 'Method not allowed' };
  }

  return { valid: true };
}
