import type { SupabaseClient } from '@supabase/supabase-js';
import type { DBNotification } from 'oa-shared';
import type { LoaderFunctionArgs } from 'react-router';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { NotificationMapperServiceServer } from 'src/services/notificationMapperService.server';

const transformNotificationList = async (
  dbNotifications: DBNotification[],
  client: SupabaseClient,
) => {
  const notificationMapperService = new NotificationMapperServiceServer(client);

  return Promise.allSettled(
    dbNotifications.map((dbNotification) =>
      notificationMapperService.transformNotification(dbNotification),
    ),
  ).then((results) => {
    return results.filter((result) => result.status === 'fulfilled').map((result) => result.value);
  });
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    const claims = await client.auth.getClaims();

    if (!claims.data?.claims) {
      return Response.json({}, { headers, status: 401 });
    }

    const profileResponse = await client
      .from('profiles')
      .select('id')
      .eq('auth_id', claims.data.claims.sub)
      .maybeSingle(); // Maybe single due to dup profiles in tests

    if (!profileResponse.data || profileResponse.error) {
      throw profileResponse.error || 'No user found';
    }

    const { data, error } = await client
      .from('notifications')
      .select(
        `
      *,
      triggered_by:profiles!notifications_triggered_by_id_fkey(id,username,photo)
    `,
      )
      .eq('owned_by_id', profileResponse?.data?.id);

    if (error) {
      throw error;
    }

    const notifications = data?.length ? await transformNotificationList(data, client) : [];

    return Response.json({ notifications }, { headers, status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error }, { headers, status: 500 });
  }
};
