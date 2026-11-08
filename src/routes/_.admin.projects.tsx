import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData } from 'react-router';
import { ProjectsPage } from 'src/pages/Admin/Projects/ProjectsPage';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { LibraryServiceServer } from 'src/services/libraryService.server';

export const handle = { breadcrumb: 'Projects' };

const PAGE_SIZE = 20;

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
  const { client } = createSupabaseServerClient(request);

  const { projects, totalCount } = await new LibraryServiceServer(client).getAdminPage(
    page,
    PAGE_SIZE,
  );
  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;

  return { projects, page, totalPages, totalCount };
}

export default function Index() {
  const { projects, page, totalPages, totalCount } = useLoaderData<typeof loader>();

  return (
    <ProjectsPage projects={projects} page={page} totalPages={totalPages} totalCount={totalCount} />
  );
}
