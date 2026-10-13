import type { DBAdminNews } from 'oa-shared';
import { AdminNews } from 'oa-shared';
import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData } from 'react-router';
import { NewsPage } from 'src/pages/Admin/News/NewsPage';
import { createSupabaseServerClient } from 'src/repository/supabase.server';

export const handle = { breadcrumb: 'News' };

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = createSupabaseServerClient(request);
  const [newsResult, tagsResult] = await Promise.all([
    client
      .from('news')
      .select(
        `id,
        title,
        slug,
        category:categories(id, name),
        tags,
        moderation,
        is_draft,
        published_at,
        comment_count,
        total_views,
        poll,
        deleted,
        profiles(display_name, username)`,
      )
      .order('published_at', { ascending: false }),
    client.from('tags').select('id, name'),
  ]);
  const tagMap = new Map<number, string>((tagsResult.data || []).map((tag) => [tag.id, tag.name]));
  const news = (newsResult.data || []).map((item) =>
    AdminNews.fromDB(item as unknown as DBAdminNews, tagMap),
  );
  return { news };
}

export default function Index() {
  const { news } = useLoaderData<typeof loader>();
  return <NewsPage news={news} />;
}
