import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData } from 'react-router';
import type { OrganisationStatusFilter } from 'src/pages/Admin/Organisations/OrganisationsPage';
import { OrganisationsPage, STATUS_FILTERS } from 'src/pages/Admin/Organisations/OrganisationsPage';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { ProfileServiceServer } from 'src/services/profileService.server';

export const handle = { breadcrumb: 'Organisations', breadcrumbParent: 'Users' };

const PAGE_SIZE = 20;

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
  const search = url.searchParams.get('q')?.trim() || null;
  const statusParam = url.searchParams.get('status') as OrganisationStatusFilter;
  const defaultStatus = search ? 'all' : 'awaiting-moderation';
  const status = STATUS_FILTERS.includes(statusParam) ? statusParam : defaultStatus;
  const { client } = createSupabaseServerClient(request);

  const { organisations, totalCount } = await new ProfileServiceServer(
    client,
  ).getOrganisationsForModeration(status === 'all' ? null : status, search, page, PAGE_SIZE);
  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;

  return { organisations, status, search, page, totalPages };
}

export default function Index() {
  const { organisations, status, search, page, totalPages } = useLoaderData<typeof loader>();

  return (
    <OrganisationsPage
      organisations={organisations}
      status={status}
      search={search}
      page={page}
      totalPages={totalPages}
    />
  );
}
