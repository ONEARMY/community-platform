import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { updateUserActivity } from 'src/utils/activity.server';

import type { LoaderFunctionArgs } from 'react-router';

export const action = async ({ request }: LoaderFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    const claims = await client.auth.getClaims();

    if (!claims.data?.claims) {
      return Response.json({}, { headers, status: 401 });
    }

    const { valid, status, statusText } = await validateRequest(request);

    if (!valid) {
      return Response.json({}, { headers, status, statusText });
    }

    const profile = await client
      .from('profiles')
      .select('id')
      .eq('auth_id', claims.data.claims.sub)
      .single();

    await client
      .from('notifications')
      .update({ is_read: true })
      .eq('owned_by_id', profile?.data?.id);

    updateUserActivity(client, claims.data.claims.sub);

    return Response.json({}, { headers, status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(
      {},
      {
        headers,
        status: 500,
        statusText: 'Error setting notification as read',
      },
    );
  }
};

async function validateRequest(request: Request) {
  if (request.method !== 'POST') {
    return { status: 405, statusText: 'method not allowed' };
  }

  return { valid: true };
}
