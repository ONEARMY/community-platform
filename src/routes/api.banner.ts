import Keyv from 'keyv';
import type { DBBanner } from 'oa-shared';
import { Banner } from 'oa-shared';
import type { LoaderFunctionArgs } from 'react-router';
import { isProductionEnvironment } from 'src/config/config';
import { createSupabaseServerClient } from 'src/repository/supabase.server';

const cache = new Keyv<Banner[]>({ ttl: 600000 }); // ttl: 10 minutes

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);

  const cachedBanner = await cache.get('banner');

  if (cachedBanner && isProductionEnvironment()) {
    return Response.json(cachedBanner, { headers, status: 200 });
  }

  const { data } = await client.from('banners').select('id,text,url').limit(1);

  let banner: Banner = new Banner({ text: null, url: null });
  if (data && Array.isArray(data) && data.length > 0) {
    banner = Banner.fromDB(data[0] as DBBanner);
  }

  cache.set('banner', banner);

  return Response.json(banner, { headers, status: 200 });
}
