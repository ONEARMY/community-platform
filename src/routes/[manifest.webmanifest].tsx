import { data, type LoaderFunctionArgs } from 'react-router';
import { logger } from 'src/logger';
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
      launch_handler: {
        client_mode: 'navigate-existing',
      },
      icons: settings.pwaIcons
        ? [
            {
              src: settings.pwaIcons[16],
              sizes: '16x16',
              type: 'image/png',
              purpose: 'maskable',
            },
            {
              src: settings.pwaIcons[32],
              sizes: '32x32',
              type: 'image/png',
              purpose: 'maskable',
            },
            {
              src: settings.pwaIcons[192],
              sizes: '192x192',
              type: 'image/png',
              purpose: 'maskable',
            },
            {
              src: settings.pwaIcons[256],
              sizes: '256x256',
              type: 'image/png',
              purpose: 'maskable',
            },
            {
              src: settings.pwaIcons[512],
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
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
    logger.error(error);
  }
  return data(null, { status: 500 });
}

interface WebAppManifest {
  background_color?: string;
  categories?: string[];
  description?: string;
  dir?: 'auto' | 'ltr' | 'rtl';
  display?: 'fullscreen' | 'standalone' | 'minimal-ui' | 'browser';
  display_override?: (
    | 'fullscreen'
    | 'standalone'
    | 'minimal-ui'
    | 'browser'
    | 'window-controls-overlay'
  )[];
  iarc_rating_id?: string;
  icons?: ManifestIcon[];
  id?: string;
  lang?: string;
  launch_handler?: {
    client_mode?: 'focus-existing' | 'navigate-existing' | 'navigate-new' | 'auto';
  };
  name?: string;
  orientation?:
    | 'any'
    | 'natural'
    | 'landscape'
    | 'landscape-primary'
    | 'landscape-secondary'
    | 'portrait'
    | 'portrait-primary'
    | 'portrait-secondary';
  scope?: string;
  short_name?: string;
  start_url?: string;
  theme_color?: string;
}

interface ManifestIcon {
  src: string;
  sizes?: string;
  type?: string;
  purpose?: 'any' | 'maskable' | 'monochrome' | 'badge';
}
