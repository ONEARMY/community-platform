import type { Supporter } from 'oa-shared';
import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData } from 'react-router';
import { SupportersPage } from 'src/pages/Admin/Supporters/SupportersPage';
import { createSupabaseServerClient } from 'src/repository/supabase.server';

export const handle = { breadcrumb: 'Supporters' };

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = createSupabaseServerClient(request);

  const { data } = await client.rpc('get_supporters', {
    p_tenant_id: process.env.TENANT_ID!,
  });

  const supporters = (data || []) as Supporter[];

  return { supporters };
}

export default function Index() {
  const { supporters } = useLoaderData<typeof loader>();

  return <SupportersPage supporters={supporters} />;
}
