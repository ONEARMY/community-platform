import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { updateUserActivity } from 'src/utils/activity.server';

import type { LoaderFunctionArgs } from 'react-router';

export async function action({ request, params }: LoaderFunctionArgs) {
  if (request.method !== 'POST' && request.method !== 'DELETE') {
    return Response.json({}, { status: 405, statusText: 'method not allowed' });
  }

  const { client, headers } = createSupabaseServerClient(request);
  const claims = await client.auth.getClaims();

  if (!claims.data?.claims) {
    return Response.json({}, { headers, status: 401 });
  }

  const profileResult = await client
    .from('profiles')
    .select()
    .eq('auth_id', claims.data.claims.sub)
    .limit(1);

  if (!profileResult.data || profileResult.error) {
    console.error(profileResult.error + ' auth_id:' + claims.data.claims.sub);
    return Response.json({}, { headers, status: 400, statusText: 'user not found' });
  }

  let result;
  if (request.method === 'POST') {
    result = await client.from('useful_votes').insert({
      content_type: params.contentType,
      content_id: Number(params.contentId),
      user_id: profileResult.data[0].id,
      tenant_id: process.env.TENANT_ID!,
    });
  } else {
    result = await client
      .from('useful_votes')
      .delete()
      .eq('content_type', params.contentType)
      .eq('content_id', Number(params.contentId))
      .eq('user_id', profileResult.data[0].id)
      .eq('tenant_id', process.env.TENANT_ID!);
  }

  if (result.error) {
    console.error(result.error);
    return Response.json({}, { headers, status: 500, statusText: 'error' });
  }

  updateUserActivity(client, claims.data.claims.sub);

  return Response.json({}, { headers, status: 200 });
}
