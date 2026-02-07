import type { ActionFunctionArgs } from 'react-router';
import { createSupabaseServerClient } from 'src/repository/supabase.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);
  const formData = await request.formData();

  const oldPassword = formData.get('oldPassword') as string;
  const newPassword = formData.get('newPassword') as string;

  const claims = await client.auth.getClaims();

  const signInResult = await client.auth.signInWithPassword({
    email: claims.data?.claims?.email as string,
    password: oldPassword,
  });

  if (signInResult.error) {
    return Response.json({ error: 'Invalid password' }, { headers, status: 400 });
  }

  const result = await client.auth.updateUser({ password: newPassword });

  if (result.error) {
    return Response.json(
      {
        error: result.error.message,
      },
      { headers, status: 400 },
    );
  }

  return new Response(null, { headers, status: 204 });
};
