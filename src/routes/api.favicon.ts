import Keyv from 'keyv'
import { isProductionEnvironment } from 'src/config/config'
import { createSupabaseServerClient } from 'src/repository/supabase.server'

import type { LoaderFunctionArgs } from 'react-router'

// Cache favicon bytes + content type. Use ArrayBuffer to satisfy BodyInit typing.
const cache = new Keyv<{ body: ArrayBuffer; contentType: string }>({
  ttl: 3600000,
}) // ttl: 60 minutes

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request)

  const cached = await cache.get('favicon')
  if (cached && isProductionEnvironment()) {
    return new Response(cached.body, {
      status: 200,
      headers: {
        ...headers,
        'Content-Type': cached.contentType,
        'Cache-Control': 'public, max-age=600',
      },
    })
  }

  const { data, error } = await client
    .from('tenant_settings')
    .select('site_favicon')
    .limit(1)

  if (error) {
    return new Response('Failed to load favicon metadata', { status: 500 })
  }

  let faviconLink: string | null = null
  if (data && Array.isArray(data) && data.length > 0) {
    faviconLink = data[0].site_favicon
  }

  if (!faviconLink) {
    return new Response('Favicon not found', { status: 404 })
  }

  // Fetch the image bytes from the stored link
  const imageRes = await fetch(faviconLink)

  if (!imageRes.ok) {
    return new Response('Failed to fetch favicon image', { status: 502 })
  }

  const contentType = imageRes.headers.get('content-type') || 'image/x-icon'
  const body = await imageRes.arrayBuffer()

  // Cache the binary + content type
  cache.set('favicon', { body, contentType })

  return new Response(body, {
    status: 200,
    headers: {
      ...headers,
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=600',
    },
  })
}
