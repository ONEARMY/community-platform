import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData } from 'react-router';
import { CommentsPage } from 'src/pages/Admin/Comments/CommentsPage';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { CommentServiceServer } from 'src/services/commentService.server';

export const handle = { breadcrumb: 'Comments' };

const PAGE_SIZE = 20;

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
  const { client } = createSupabaseServerClient(request);

  const { comments, totalCount } = await new CommentServiceServer(client).getAdminPage(
    page,
    PAGE_SIZE,
  );
  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;

  return { comments, page, totalPages };
}

export default function Index() {
  const { comments, page, totalPages } = useLoaderData<typeof loader>();

  return <CommentsPage comments={comments} page={page} totalPages={totalPages} />;
}
