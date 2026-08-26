import type { DBTag } from 'oa-shared';
import { Tag } from 'oa-shared';
import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData } from 'react-router';
import { TagsPage } from 'src/pages/Admin/Tags/TagsPage';
import { createSupabaseServerClient } from 'src/repository/supabase.server';

export const handle = { breadcrumb: 'Tags' };

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = createSupabaseServerClient(request);

  const { data } = await client.from('tags').select('id,name,created_at,modified_at').order('name');

  const tags = (data || []).map((tag) => Tag.fromDB(tag as DBTag));

  return { tags };
}

export default function Index() {
  const { tags } = useLoaderData<typeof loader>();

  return <TagsPage tags={tags} />;
}
