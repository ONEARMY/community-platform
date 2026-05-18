import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { TenantSettingsService } from 'src/services/tenantSettingsService.server';

export const loader = async ({ request }: { request: Request }) => {
  const { headers } = request;

  const host = headers.get('host');
  let robotText = '';

  if (host?.includes('fly.dev')) {
    // disable for preview sites
    robotText = `User-agent: *
      Disallow: /`;
  } else {
    const { client } = createSupabaseServerClient(request);
    const settings = await new TenantSettingsService(client).get();

    const allModules = ['library', 'map', 'research', 'academy', 'questions', 'news'];
    const availableModules = settings.supportedModules?.split(',');
    const hiddenModules = settings.hiddenModules?.split(',').map((s) => s.trim()) || [];

    robotText = 'User-agent: *';

    allModules.forEach((x) => {
      let pagePath = `/${x}/`;

      const isSupported = availableModules?.includes(x);
      const isHidden = hiddenModules.includes(x);
      const permission = isSupported && !isHidden ? 'Allow' : 'Disallow';

      robotText += `\n${permission}: ${pagePath}`;
    });
  }

  return new Response(robotText, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
};
