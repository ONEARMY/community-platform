import { createSupabaseServerClient } from 'src/repository/supabase.server';

import type { LoaderFunctionArgs } from 'react-router';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);
  const claims = await client.auth.getClaims();

  if (!claims.data?.claims) {
    return Response.json({}, { headers, status: 401 });
  }

  const { data } = await client
    .from('subscribers')
    .select('id, profiles!inner(id)')
    .eq('content_id', params.contentId)
    .eq('content_type', params.contentType)
    .eq('profiles.auth_id', claims.data.claims.sub);

  const subscribed = !!data && !(data.length === 0);

  return Response.json({ subscribed }, { headers, status: 200 });
}
