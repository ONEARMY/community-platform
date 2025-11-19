import { createSupabaseServerClient } from 'src/repository/supabase.server';

import type { LoaderFunctionArgs } from 'react-router';

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);

  const tagsResult = await client.from('tags').select('id,name,created_at,modified_at');

  const tags = tagsResult.data || [];

  return Response.json(tags, { headers, status: 200 });
}
