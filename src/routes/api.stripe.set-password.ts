import type { ActionFunctionArgs } from 'react-router';
import { logger } from 'src/logger';
import { createSupabaseAdminServerClient } from 'src/repository/supabaseAdmin.server';
import { StripeServiceServer } from 'src/services/stripeService.server';
import { issueSignInTicket } from 'src/services/supporterSignInTicket.server';
import { methodNotAllowedError } from 'src/utils/httpException';

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== 'POST') {
    throw methodNotAllowedError();
  }

  try {
    const { stripeCustomerId, setupToken, password } = await request.json();

    if (!stripeCustomerId || !setupToken || !password) {
      return Response.json(
        { error: 'stripeCustomerId, setupToken, and password are required.' },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return Response.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    const adminClient = createSupabaseAdminServerClient();

    const subscription = await StripeServiceServer.getSetupSubscription(
      stripeCustomerId,
      setupToken,
    );
    const setupAuthId = subscription?.metadata.setup_auth_id;
    if (!subscription || !setupAuthId) {
      return Response.json({ error: 'No account found for this checkout.' }, { status: 404 });
    }

    const { data: updated, error: updateError } = await adminClient.auth.admin.updateUserById(
      setupAuthId,
      { password },
    );

    if (updateError || !updated.user?.email) {
      logger.error('Error updating password:', updateError);
      return Response.json({ error: 'Failed to update password.' }, { status: 500 });
    }

    await StripeServiceServer.updateSubscriptionMetadata(subscription.id, {
      setup_token_hash: '',
      setup_auth_id: '',
    });

    const signInTicket = await issueSignInTicket(updated.user.email);

    return Response.json({ success: true, signInTicket }, { status: 200 });
  } catch (error: any) {
    logger.error('Error setting password:', error);
    return Response.json(
      { error: error?.message || 'An unexpected error occurred.' },
      { status: 500 },
    );
  }
};
