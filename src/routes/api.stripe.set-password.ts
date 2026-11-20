import type { ActionFunctionArgs } from 'react-router';
import { logger } from 'src/logger';
import { createSupabaseAdminServerClient } from 'src/repository/supabaseAdmin.server';
import { StripeServiceServer } from 'src/services/stripeService.server';
import { signInSupporter } from 'src/services/supporterSignIn.server';
import { methodNotAllowedError } from 'src/utils/httpException';

const PENDING_PASSWORD_WINDOW_MS = 60 * 60 * 1000;

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== 'POST') {
    throw methodNotAllowedError();
  }

  try {
    const { email, stripeCustomerId, password } = await request.json();

    if (!email || !stripeCustomerId || !password) {
      return Response.json(
        { error: 'Email, stripeCustomerId, and password are required.' },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return Response.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    const adminClient = createSupabaseAdminServerClient();
    const stripeService = new StripeServiceServer(adminClient);

    const customer = await StripeServiceServer.getStripeCustomer(stripeCustomerId);
    if (!customer || customer.email?.toLowerCase() !== email.toLowerCase()) {
      return Response.json({ error: 'Invalid customer or email mismatch.' }, { status: 400 });
    }

    const tenantId = process.env.TENANT_ID;
    const linkedAuthId = await stripeService.getAuthIdByStripeCustomerId(
      stripeCustomerId,
      tenantId,
    );
    if (!linkedAuthId) {
      return Response.json(
        { error: 'No linked account found for this customer.' },
        { status: 404 },
      );
    }

    const { data: linkedUser } = await adminClient.auth.admin.getUserById(linkedAuthId);
    if (linkedUser.user?.app_metadata.supporter_password_pending !== true) {
      return Response.json(
        { error: 'No linked account found for this customer.' },
        { status: 404 },
      );
    }

    const accountAgeMs = Date.now() - new Date(linkedUser.user.created_at).getTime();
    if (accountAgeMs > PENDING_PASSWORD_WINDOW_MS) {
      return Response.json(
        { error: 'This link has expired. Use "Forgot your password?" on the sign-in page.' },
        { status: 410 },
      );
    }

    const { error: updateError } = await adminClient.auth.admin.updateUserById(linkedAuthId, {
      password,
      app_metadata: { supporter_password_pending: false },
    });

    if (updateError) {
      logger.error('Error updating password:', updateError);
      return Response.json({ error: 'Failed to update password.' }, { status: 500 });
    }

    const headers = await signInSupporter(request, email);

    return Response.json({ success: true }, { status: 200, headers });
  } catch (error: any) {
    logger.error('Error setting password:', error);
    return Response.json(
      { error: error?.message || 'An unexpected error occurred.' },
      { status: 500 },
    );
  }
};
