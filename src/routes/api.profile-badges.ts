import Keyv from 'keyv';
import type { DBProfileBadge } from 'oa-shared';
import { ProfileBadge } from 'oa-shared';
import type { LoaderFunctionArgs } from 'react-router';
import { isProductionEnvironment } from 'src/config/config';
import { createSupabaseServerClient } from 'src/repository/supabase.server';

const cache = new Keyv<ProfileBadge[]>({ ttl: 3600000 }); // ttl: 60 minutes

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);

  const cachedProfileBadges = await cache.get('profileBadges');

  if (
    cachedProfileBadges &&
    Array.isArray(cachedProfileBadges) &&
    cachedProfileBadges.length &&
    isProductionEnvironment()
  ) {
    return Response.json(cachedProfileBadges, { headers, status: 200 });
  }

  const { data } = await client.from('profile_badges').select('*');

  const profileBadges = data?.map((badge) => ProfileBadge.fromDB(badge as DBProfileBadge));

  if (profileBadges && profileBadges.length > 0) {
    cache.set('profileBadges', data, 3600000);
  }

  return Response.json(profileBadges, { headers, status: 200 });
}
