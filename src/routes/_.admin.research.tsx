import type { LoaderFunctionArgs } from 'react-router';
import { redirect, useLoaderData } from 'react-router';
import type { AdminResearchItem } from 'src/pages/Admin/Research/ResearchPage';
import { ResearchPage } from 'src/pages/Admin/Research/ResearchPage';
import { createSupabaseServerClient } from 'src/repository/supabase.server';

export const handle = { breadcrumb: 'Research' };

const PAGE_SIZE = 25;

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const requestedPage = Number.parseInt(url.searchParams.get('page') || '', 10);
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const from = (page - 1) * PAGE_SIZE;
  const { client } = createSupabaseServerClient(request);

  const { data, count, error } = await client
    .from('research')
    .select(
      `
      id,
      title,
      slug,
      status,
      is_draft,
      deleted,
      published_at,
      created_at,
      total_views,
      total_useful,
      collaborators,
      category:categories(name),
      author:profiles!research_created_by_fkey(username, display_name)
    `,
      { count: 'exact' },
    )
    .order('created_at', { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  if (error?.code === 'PGRST103') {
    throw redirect('/admin/research');
  }

  if (error) {
    throw error;
  }

  const ids = (data || []).map((research) => research.id);
  const updateCounts = new Map<number, number>();

  if (ids.length > 0) {
    const { data: updates, error: updatesError } = await client
      .from('research_updates')
      .select('research_id')
      .in('research_id', ids)
      .or('deleted.is.null,deleted.eq.false');

    if (updatesError) {
      throw updatesError;
    }

    for (const update of updates || []) {
      updateCounts.set(update.research_id, (updateCounts.get(update.research_id) || 0) + 1);
    }
  }

  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;

  const research: AdminResearchItem[] = (data || []).map((item: any) => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    status: item.status,
    isDraft: item.is_draft || false,
    deleted: item.deleted || false,
    publishedAt: item.published_at,
    createdAt: item.created_at,
    totalViews: item.total_views || 0,
    totalUseful: item.total_useful || 0,
    updateCount: updateCounts.get(item.id) || 0,
    collaboratorCount: item.collaborators?.length || 0,
    category: item.category?.name || null,
    author: item.author
      ? { username: item.author.username, displayName: item.author.display_name }
      : null,
  }));

  return { research, page, totalPages, totalCount };
}

export default function Index() {
  const { research, page, totalPages, totalCount } = useLoaderData<typeof loader>();

  return (
    <ResearchPage research={research} page={page} totalPages={totalPages} totalCount={totalCount} />
  );
}
