import Keyv from 'keyv';
import { isProductionEnvironment } from 'src/config/config';
import { createSupabaseServerClient } from 'src/repository/supabase.server';

import type { LoaderFunctionArgs } from 'react-router';

const cache = new Keyv<{ body: string; contentType: string }>({
  ttl: 3600000,
}); // ttl: 60 minutes

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);

  const cached = await cache.get('favicon');
  if (cached && isProductionEnvironment()) {
    // Convert base64 back to Buffer for Response
    const binary = Buffer.from(cached.body, 'base64');
    return new Response(binary, {
      status: 200,
      headers: {
        ...headers,
        'Content-Type': cached.contentType,
        'Cache-Control': 'public, max-age=600',
      },
    });
  }

  const { data, error } = await client
    .from('tenant_settings')
    .select('site_favicon')
    .eq('tenant_id', process.env.TENANT_ID)
    .limit(1);

  if (error) {
    return new Response('Failed to load favicon metadata', { status: 500 });
  }

  let faviconLink: string | null = null;
  if (data && Array.isArray(data) && data.length > 0) {
    faviconLink = data[0].site_favicon;
  }

  if (!faviconLink) {
    return new Response('Favicon not found', { status: 404 });
  }

  // Fetch the image bytes from the stored link
  const imageRes = await fetch(faviconLink);

  if (!imageRes.ok) {
    return new Response('Failed to fetch favicon image', { status: 502 });
  }

  const contentType = imageRes.headers.get('content-type') || 'image/x-icon';
  const body = await imageRes.arrayBuffer();

  // Cache as base64 string (ArrayBuffer doesn't serialize well)
  const base64Body = Buffer.from(body).toString('base64');
  cache.set('favicon', { body: base64Body, contentType });

  return new Response(body, {
    status: 200,
    headers: {
      ...headers,
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=600',
    },
  });
}
