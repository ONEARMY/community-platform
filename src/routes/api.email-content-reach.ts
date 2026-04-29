import Keyv from 'keyv';
import { EmailContentReach } from 'oa-shared';
import type { LoaderFunctionArgs } from 'react-router';
import { isProductionEnvironment } from 'src/config/config';
import { createSupabaseServerClient } from 'src/repository/supabase.server';

const cache = new Keyv<EmailContentReach[]>({ ttl: 3600000 }); // ttl: 60 minutes

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);

  const cachedEmailContentReach = await cache.get('emailContentReach');

  if (cachedEmailContentReach && isProductionEnvironment()) {
    return Response.json(cachedEmailContentReach, { headers, status: 200 });
  }

  const dbEmailContentReachResults = await client.from('email_content_reach').select('*');

  const emailContentReach = dbEmailContentReachResults.data
    ? dbEmailContentReachResults.data.map((dbReach) => EmailContentReach.fromDB(dbReach))
    : [];

  if (emailContentReach) {
    cache.set('emailContentReach', emailContentReach, 3600000);
  }

  return Response.json(emailContentReach, { headers, status: 200 });
};
