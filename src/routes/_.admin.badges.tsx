import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData } from 'react-router';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { ProfileBadgeServiceServer } from 'src/services/profileBadgeService.server';
import { BadgesPage } from '@/pages/Admin/Badges/BadgesPage';

export const handle = { breadcrumb: 'Badges' };

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = createSupabaseServerClient(request);

  const profileBadges = await new ProfileBadgeServiceServer(client).getAllWithUsage();

  return { profileBadges };
}

export default function Index() {
  const { profileBadges } = useLoaderData<typeof loader>();

  return <BadgesPage profileBadges={profileBadges} />;
}
