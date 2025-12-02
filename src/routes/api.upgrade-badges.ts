import Keyv from 'keyv';
import { UpgradeBadge } from 'oa-shared';
import { isProductionEnvironment } from 'src/config/config';
import { createSupabaseServerClient } from 'src/repository/supabase.server';

import type { DBUpgradeBadge } from 'oa-shared';
import type { LoaderFunctionArgs } from 'react-router';

const cache = new Keyv<UpgradeBadge[]>({ ttl: 1800000 }); // ttl: 30 minutes

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);

  const cachedUpgradeBadges = await cache.get('upgradeBadges');

  if (
    cachedUpgradeBadges &&
    Array.isArray(cachedUpgradeBadges) &&
    cachedUpgradeBadges.length &&
    isProductionEnvironment()
  ) {
    return Response.json(cachedUpgradeBadges, { headers, status: 200 });
  }

  const { data } = await client
    .from('upgrade_badge')
    .select(
      `
      *,
      badge:profile_badges(id, name, display_name, image_url, action_url)
    `,
    );

  const upgradeBadges = data?.map((badge) => UpgradeBadge.fromDB(badge as DBUpgradeBadge));

  if (upgradeBadges && upgradeBadges.length > 0) {
    cache.set('upgradeBadges', upgradeBadges, 1800000);
  }

  return Response.json(upgradeBadges, { headers, status: 200 });
}
