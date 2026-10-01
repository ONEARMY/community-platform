import type { LoaderFunctionArgs } from 'react-router';
import { redirect, useLoaderData } from 'react-router';
import { CommentsPage } from 'src/pages/Admin/Comments/CommentsPage';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { CommentServiceServer } from 'src/services/commentService.server';
import { TenantSettingsService } from 'src/services/tenantSettingsService.server';

export const handle = { breadcrumb: 'Comments' };

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = createSupabaseServerClient(request);
  const url = new URL(request.url);
  const pageParam = url.searchParams.get('page');
  const requestedPage = Math.max(1, parseInt(pageParam || '1') || 1);
  const settings = await new TenantSettingsService(client).get();

  const { comments, page, totalPages } = await new CommentServiceServer(client).getAdminPage(
    requestedPage,
    settings.supportedModules,
  );

  if (
    pageParam !== null &&
    (pageParam !== String(page) || url.searchParams.getAll('page').length > 1)
  ) {
    url.searchParams.set('page', String(page));
    return redirect(`${url.pathname}${url.search}`);
  }

  return { comments, page, totalPages };
}

export default function Index() {
  const { comments, page, totalPages } = useLoaderData<typeof loader>();

  return <CommentsPage comments={comments} page={page} totalPages={totalPages} />;
}
