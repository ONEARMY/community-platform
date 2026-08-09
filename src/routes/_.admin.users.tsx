import type { ProfileTypeCount, SupporterBadgeCount } from 'oa-shared';
import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData } from 'react-router';
import { UsersOverviewPage } from 'src/pages/Admin/Users/UsersOverviewPage';
import { createSupabaseServerClient } from 'src/repository/supabase.server';

export const handle = { breadcrumb: 'Overview', breadcrumbParent: 'Users' };

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = createSupabaseServerClient(request);

  const [profileTypeCounts, supporterBadgeCounts] = await Promise.all([
    client.rpc('get_profile_type_counts', { p_tenant_id: process.env.TENANT_ID! }),
    client.rpc('get_supporter_badge_counts', { p_tenant_id: process.env.TENANT_ID! }),
  ]);

  return {
    profileTypeCounts: (profileTypeCounts.data || []) as ProfileTypeCount[],
    supporterBadgeCounts: (supporterBadgeCounts.data || []) as SupporterBadgeCount[],
  };
}

export default function Index() {
  const { profileTypeCounts, supporterBadgeCounts } = useLoaderData<typeof loader>();

  return (
    <UsersOverviewPage
      profileTypeCounts={profileTypeCounts}
      supporterBadgeCounts={supporterBadgeCounts}
    />
  );
}
