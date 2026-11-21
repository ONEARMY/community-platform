import type { LoaderFunctionArgs } from 'react-router';
import { redirect, useLoaderData } from 'react-router';
import type { AdminMessage } from 'src/pages/Admin/Messages/MessagesPage';
import { MessagesPage } from 'src/pages/Admin/Messages/MessagesPage';
import { createSupabaseAdminServerClient } from 'src/repository/supabaseAdmin.server';

export const handle = { breadcrumb: 'Messages' };

const PAGE_SIZE = 25;

const toProfile = (profile: { username: string | null; display_name: string | null } | null) =>
  profile ? { username: profile.username, displayName: profile.display_name || '' } : null;

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const client = createSupabaseAdminServerClient();

  const { data, count, error } = await client
    .from('messages')
    .select(
      `
      id,
      message,
      created_at,
      sender:profiles!messages_sender_fkey(username, display_name),
      receiver:profiles!messages_receiver_fkey(username, display_name)
    `,
      { count: 'exact' },
    )
    .eq('tenant_id', process.env.TENANT_ID!)
    .order('created_at', { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  if (error?.code === 'PGRST103') {
    throw redirect('/admin/messages');
  }

  if (error) {
    throw error;
  }

  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;

  const messages: AdminMessage[] = (data || []).map((item) => ({
    id: item.id,
    message: item.message,
    createdAt: item.created_at,
    sender: toProfile(item.sender),
    receiver: toProfile(item.receiver),
  }));

  return { messages, page, totalPages, totalCount };
}

export default function Index() {
  const { messages, page, totalPages, totalCount } = useLoaderData<typeof loader>();

  return (
    <MessagesPage messages={messages} page={page} totalPages={totalPages} totalCount={totalCount} />
  );
}
