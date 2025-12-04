import { UpgradeBadge } from 'oa-shared';
import { createSupabaseServerClient } from 'src/repository/supabase.server';

import type { DBUpgradeBadge } from 'oa-shared';
import type { LoaderFunctionArgs } from 'react-router';

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);

  const { data } = await client.from('upgrade_badge').select(
    `
      *,
      badge:profile_badges(id, name, display_name, image_url, action_url)
    `,
  );

  const upgradeBadges = data?.map((badge) => UpgradeBadge.fromDB(badge as DBUpgradeBadge));

  return Response.json(upgradeBadges, { headers, status: 200 });
}
