import type { ActionFunctionArgs } from 'react-router';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { createSupabaseAdminServerClient } from 'src/repository/supabaseAdmin.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);
  const formData = await request.formData();

  const password = formData.get('password') as string;

  const claims = await client.auth.getClaims();

  if (!claims.data?.claims) {
    return Response.json({ error: 'Not authenticated' }, { headers, status: 401 });
  }

  const signInResult = await client.auth.signInWithPassword({
    email: claims.data.claims.email as string,
    password,
  });

  if (signInResult.error) {
    return Response.json({ error: 'Invalid password' }, { headers, status: 400 });
  }

  const adminClient = createSupabaseAdminServerClient();
  const result = await adminClient.auth.admin.deleteUser(claims.data.claims.sub);

  if (result.error) {
    return Response.json({ error: result.error.message }, { headers, status: 500 });
  }

  return new Response(null, { headers, status: 204 });
};
