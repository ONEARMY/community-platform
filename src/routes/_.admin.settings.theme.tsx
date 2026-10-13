import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData } from 'react-router';
import { ThemeSettingsPage } from 'src/pages/Admin/Settings/ThemeSettingsPage';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { TenantSettingsService } from 'src/services/tenantSettingsService.server';

export const handle = { breadcrumb: 'Colour theme', breadcrumbParent: 'Settings' };

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = createSupabaseServerClient(request);

  const settings = await new TenantSettingsService(client).get(true);

  return {
    colorPrimary: settings.colorPrimary ?? '',
    colorPrimaryHover: settings.colorPrimaryHover ?? '',
    colorAccent: settings.colorAccent ?? '',
    colorAccentHover: settings.colorAccentHover ?? '',
    colorSecondary: settings.colorSecondary ?? '',
  };
}

export default function Index() {
  const colors = useLoaderData<typeof loader>();

  return <ThemeSettingsPage colors={colors} />;
}
