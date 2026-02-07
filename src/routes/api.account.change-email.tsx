import { FRIENDLY_MESSAGES } from 'oa-shared';
import type { ActionFunctionArgs } from 'react-router';
import { createSupabaseServerClient } from 'src/repository/supabase.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);
  const formData = await request.formData();

  const newEmail = formData.get('email') as string;
  const password = formData.get('password') as string;

  const claims = await client.auth.getClaims();

  const signInResult = await client.auth.signInWithPassword({
    email: claims.data?.claims?.email as string,
    password,
  });

  if (signInResult.error) {
    return Response.json({ error: 'Invalid password' }, { headers, status: 400 });
  }

  const url = new URL(request.url);
  const protocol = url.host.startsWith('localhost') ? 'http:' : 'https:';
  const emailRedirectUrl = `${protocol}//${url.host}/settings/account`;

  const result = await client.auth.updateUser(
    { email: newEmail },
    {
      emailRedirectTo: emailRedirectUrl,
    },
  );

  if (result.error) {
    return Response.json(
      {
        error: result.error.code === 'email_exists' ? FRIENDLY_MESSAGES['auth/email-already-in-use'] : FRIENDLY_MESSAGES['generic'],
      },
      { headers, status: 400 },
    );
  }

  return new Response(null, { headers, status: 204 });
};
