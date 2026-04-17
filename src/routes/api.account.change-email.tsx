import { HTTPException } from 'hono/http-exception';
import { FRIENDLY_MESSAGES } from 'oa-shared';
import type { ActionFunctionArgs } from 'react-router';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { unauthorizedError, validationError } from 'src/utils/httpException';

export const action = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    const formData = await request.formData();

    const newEmail = formData.get('email') as string;
    const password = formData.get('password') as string;

    const claims = await client.auth.getClaims();

    if (!claims.data?.claims) {
      throw unauthorizedError();
    }

    const signInResult = await client.auth.signInWithPassword({
      email: claims.data?.claims?.email as string,
      password,
    });

    if (signInResult.error) {
      throw validationError('Invalid password');
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
      const errorMessage =
        result.error.code === 'email_exists'
          ? FRIENDLY_MESSAGES['auth/email-already-in-use']
          : FRIENDLY_MESSAGES['generic'];
      throw validationError(errorMessage);
    }
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    console.error(error);
    return Response.json({ error: 'Error changing email', status: 500 }, { status: 500 });
  }

  return new Response(null, { headers, status: 204 });
};
