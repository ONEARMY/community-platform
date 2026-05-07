import { WebAppManifest } from 'oa-shared';
import { type LoaderFunctionArgs } from 'react-router';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { TenantSettingsService } from 'src/services/tenantSettingsService.server';

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const { client } = createSupabaseServerClient(request);

    const settings = await new TenantSettingsService(client).get();

    const manifest = {
      name: settings.siteName,
      short_name: settings.siteName,
      description: settings.siteDescription,
      theme_color: settings.colorPrimary,
      background_color: '#f4f6f7',
      display: 'standalone',
      scope: '/',
      start_url: '/',
      icons: settings.pwaIcons
        ? [
            {
              src: settings.pwaIcons[16],
              sizes: '16x16',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: settings.pwaIcons[32],
              sizes: '32x32',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: settings.pwaIcons[192],
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: settings.pwaIcons[256],
              sizes: '256x256',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: settings.pwaIcons[512],
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
          ]
        : undefined,
    } satisfies WebAppManifest;

    return new Response(JSON.stringify(manifest), {
      status: 200,
      headers: {
        'Content-Type': 'application/manifest+json',
      },
    });
  } catch (error) {
    console.error(error);
  }
  return Response.json(null, { status: 500 });
}
