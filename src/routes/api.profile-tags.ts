import type { DBProfileTag } from 'oa-shared';
import { ProfileTag } from 'oa-shared';
import type { LoaderFunctionArgs } from 'react-router';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { dbResultArray } from 'src/utils/supabase.types';

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);

  const profileTagsResult = await client
    .from('profile_tags')
    .select('id,created_at,name,profile_type');

  const dbTags = dbResultArray<DBProfileTag>(profileTagsResult.data || []);
  const tags = dbTags.map((x) => ProfileTag.fromDB(x));

  return Response.json(tags, { headers, status: 200 });
}
