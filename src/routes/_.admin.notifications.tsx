import type { NotificationStats } from 'oa-shared';
import type { LoaderFunctionArgs } from 'react-router';
import { redirect, useLoaderData } from 'react-router';
import type { AdminNotification } from 'src/pages/Admin/Notifications/NotificationsPage';
import { NotificationsPage } from 'src/pages/Admin/Notifications/NotificationsPage';
import { createSupabaseAdminServerClient } from 'src/repository/supabaseAdmin.server';

export const handle = { breadcrumb: 'Notifications' };

const PAGE_SIZE = 25;
const WEEKS = 12;

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const client = createSupabaseAdminServerClient();
  const tenantId = process.env.TENANT_ID!;

  const [statsResult, listResult] = await Promise.all([
    client.rpc('get_admin_notification_stats', { p_tenant_id: tenantId, p_weeks: WEEKS }),
    client
      .from('notifications')
      .select(
        `
        id,
        title,
        action_type,
        content_type,
        is_read,
        created_at,
        recipient:profiles!notifications_owned_by_id_fkey(username, display_name)
      `,
        { count: 'exact' },
      )
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })
      .range(from, from + PAGE_SIZE - 1),
  ]);

  if (listResult.error?.code === 'PGRST103') {
    throw redirect('/admin/notifications');
  }

  if (statsResult.error) {
    throw statsResult.error;
  }

  if (listResult.error) {
    throw listResult.error;
  }

  const totalPages = Math.ceil((listResult.count || 0) / PAGE_SIZE) || 1;

  const notifications: AdminNotification[] = (listResult.data || []).map((item) => ({
    id: item.id,
    title: item.title,
    actionType: item.action_type,
    contentType: item.content_type,
    isRead: !!item.is_read,
    createdAt: item.created_at,
    recipient: item.recipient
      ? { username: item.recipient.username, displayName: item.recipient.display_name || '' }
      : null,
  }));

  return {
    stats: statsResult.data as unknown as NotificationStats,
    notifications,
    page,
    totalPages,
  };
}

export default function Index() {
  const { stats, notifications, page, totalPages } = useLoaderData<typeof loader>();

  return (
    <NotificationsPage
      stats={stats}
      notifications={notifications}
      page={page}
      totalPages={totalPages}
    />
  );
}
