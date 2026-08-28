import { HTTPException } from 'hono/http-exception';
import { type ActionFunctionArgs, data } from 'react-router';
import { logger } from 'src/logger';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { unauthorizedError, validationError } from 'src/utils/httpException';
import { createSupabaseAdminServerClient } from '@/repository/supabaseAdmin.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);
  const adminClient = createSupabaseAdminServerClient();

  try {
    const formData = await request.formData();

    const oldPassword = formData.get('oldPassword') as string;
    const newPassword = formData.get('newPassword') as string;

    const claims = await client.auth.getClaims();

    if (!claims.data?.claims) {
      throw unauthorizedError();
    }

    const signInResult = await adminClient.auth.signInWithPassword({
      email: claims.data?.claims?.email as string,
      password: oldPassword,
    });

    if (signInResult.error) {
      console.error(signInResult.error);
      throw validationError('Invalid password');
    }

    const result = await client.auth.updateUser({ password: newPassword });

    if (result.error) {
      throw validationError(result.error.message);
    }
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    logger.error(error);
    return data({ error: 'Error changing password', status: 500 }, { status: 500 });
  }

  return new Response(null, { headers, status: 204 });
};
