import type { LoaderFunctionArgs } from 'react-router';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { ProfileBadgeServiceServer } from 'src/services/profileBadgeService.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);

  const profileBadges = await new ProfileBadgeServiceServer(client).getAll();

  return Response.json(profileBadges, { headers, status: 200 });
}
