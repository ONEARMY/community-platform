import type { ActionFunctionArgs } from 'react-router';
import { data, redirect } from 'react-router';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { getReturnUrl } from 'src/utils/redirect.server';

export const loader = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);

  const { error } = await client.auth.signOut();

  if (error) {
    return data({ success: false }, { headers });
  }

  return redirect(getReturnUrl(request), { headers });
};
