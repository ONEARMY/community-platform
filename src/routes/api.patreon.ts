import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { updateUserActivity } from 'src/utils/activity.server';

import { patreonServiceServer } from '../services/patreonService.server';

export const loader = async ({ request }) => {
  const { client, headers } = createSupabaseServerClient(request);

  const claims = await client.auth.getClaims();

  if (!claims.data?.claims) {
    return Response.json({}, { headers, status: 401 });
  }

  const { data } = await client
    .from('profiles')
    .select('patreon,is_supporter')
    .eq('auth_id', claims.data.claims.sub)
    .single();

  return Response.json(
    { isSupporter: data?.is_supporter, patreon: data?.patreon },
    { headers, status: 200 },
  );
};

export const action = async ({ request }) => {
  const { client, headers } = createSupabaseServerClient(request);

  if (request.method !== 'DELETE') {
    return Response.json({}, { headers, status: 405, statusText: 'method not allowed' });
  }

  const claims = await client.auth.getClaims();

  if (!claims.data?.claims) {
    return Response.json({}, { headers, status: 401 });
  }

  try {
    await patreonServiceServer.disconnectUser(claims.data.claims.sub, client);

    updateUserActivity(client, claims.data.claims.sub);

    return Response.json({}, { headers, status: 200 });
  } catch (err) {
    return Response.json({}, { headers, status: 500 });
  }
};
