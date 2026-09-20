import type { DBBanner } from 'oa-shared';
import { Banner } from 'oa-shared';
import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData } from 'react-router';
import { BannersPage } from 'src/pages/Admin/Banners/BannersPage';
import { createSupabaseServerClient } from 'src/repository/supabase.server';

export const handle = { breadcrumb: 'Banner' };

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = createSupabaseServerClient(request);

  const { data } = await client
    .from('banners')
    .select('id,text,url,created_at,modified_at')
    .order('id')
    .limit(1);

  const banner = data?.length ? Banner.fromDB(data[0] as DBBanner) : null;

  return { banner };
}

export default function Index() {
  const { banner } = useLoaderData<typeof loader>();

  return <BannersPage banner={banner} />;
}
