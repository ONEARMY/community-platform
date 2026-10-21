import { type NotificationContentType, NotificationContentTypes } from 'oa-shared';
import type { LoaderFunctionArgs } from 'react-router';
import { logger } from 'src/logger';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { NotificationMapperServiceServer } from 'src/services/notificationMapperService.server';

function hasSupportedContentType<T extends { content_type: string }>(
  notification: T,
): notification is T & { content_type: NotificationContentType } {
  return NotificationContentTypes.includes(notification.content_type as NotificationContentType);
}

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
      .eq('owned_by_id', profileResponse.data.id)
      .order('is_read', { ascending: true, nullsFirst: true })
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      throw error;
    }

    const notifications = data?.length
      ? await new NotificationMapperServiceServer(client).transformNotifications(
          data.filter(hasSupportedContentType),
        )
      : [];

    return Response.json({ notifications }, { headers, status: 200 });
  } catch (error) {
    logger.error(error);
    return Response.json({ error }, { headers, status: 500 });
  }
};
