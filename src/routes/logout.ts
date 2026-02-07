import type { ActionFunctionArgs } from 'react-router';
import { redirect } from 'react-router';
import { createSupabaseServerClient } from 'src/repository/supabase.server';

export const loader = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);
  const { error } = await client.auth.signOut();

  if (error) {
    return Response.json({ success: false }, { headers });
  }

  const url = new URL(request.url);
  const returnUrl = url.searchParams.get('returnUrl');

  const location = returnUrl || '/';

  return redirect(location);
};
