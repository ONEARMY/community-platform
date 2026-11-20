import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from 'oa-shared';
import { TenantSettingsService } from 'src/services/tenantSettingsService.server';

export const getReturnUrl = (request: Request, fallbackPath: string = '/') => {
  const url = new URL(request.url);
  const returnUrl = url.searchParams.get('returnUrl');

  if (!returnUrl) {
    return fallbackPath;
  }

  const path = decodeURIComponent(returnUrl);

  return isSameOriginPath(path, url.origin) ? path : fallbackPath;
};

const isSameOriginPath = (path: string, origin: string) =>
  path.startsWith('/') && new URL(path, origin).origin === origin;

export const getSiteUrl = async (client: SupabaseClient<Database>, path: string) => {
  const flyApp = process.env.FLY_APP_NAME;
  const origin =
    process.env.VITE_BRANCH === 'preview' && flyApp
      ? `https://${flyApp}.fly.dev`
      : (await new TenantSettingsService(client).get()).siteUrl;

  return new URL(path, origin).toString();
};
