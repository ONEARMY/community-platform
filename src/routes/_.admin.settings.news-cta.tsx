import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData } from 'react-router';
import { NewsCtaSettingsPage } from 'src/pages/Admin/Settings/NewsCtaSettingsPage';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { TenantSettingsService } from 'src/services/tenantSettingsService.server';

export const handle = { breadcrumb: 'News CTA', breadcrumbParent: 'Settings' };

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = createSupabaseServerClient(request);

  const settings = await new TenantSettingsService(client).get(true);

  return {
    newsCtaTitle: settings.newsCtaTitle ?? null,
    newsCtaBody: settings.newsCtaBody ?? null,
    newsCtaImageUrl: settings.newsCtaImageUrl ?? null,
  };
}

export default function Index() {
  const settings = useLoaderData<typeof loader>();

  return <NewsCtaSettingsPage {...settings} />;
}
