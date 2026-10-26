import type { ActionFunctionArgs } from 'react-router';
import { logger } from 'src/logger';
import { createSupabaseAdminServerClient } from 'src/repository/supabaseAdmin.server';
import { StripeAdminService, StripeServiceServer } from 'src/services/stripeService.server';
import { signInSupporter } from 'src/services/supporterSignIn.server';
import { methodNotAllowedError } from 'src/utils/httpException';

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== 'POST') {
    throw methodNotAllowedError();
  }

  try {
    const { email, password, stripeCustomerId } = await request.json();

    if (!email || !password || !stripeCustomerId) {
      return Response.json(
        { error: 'Email, password, and stripeCustomerId are required.' },
        { status: 400 },
      );
    }

    const adminClient = createSupabaseAdminServerClient();
    const stripeAdmin = new StripeAdminService();

    const customer = await StripeServiceServer.getStripeCustomer(stripeCustomerId);
    if (!customer || customer.email?.toLowerCase() !== email.toLowerCase()) {
      return Response.json({ error: 'Invalid customer or email mismatch.' }, { status: 400 });
    }

    const tenantId = process.env.TENANT_ID;
    if (!tenantId) {
      return Response.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const { data: signInData, error: signInError } = await adminClient.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !signInData.user) {
      return Response.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    await stripeAdmin.linkCustomerToAuthUser(stripeCustomerId, signInData.user.id, tenantId);

    const subscription = await StripeServiceServer.getSubscription(stripeCustomerId);
    await stripeAdmin.assignBadgeForActiveSubscription(subscription, signInData.user.id, tenantId);

    const headers = await signInSupporter(request, email);

    return Response.json({ success: true }, { status: 200, headers });
  } catch (error: any) {
    logger.error('Error linking supporter account:', error);
    return Response.json(
      { error: error?.message || 'An unexpected error occurred.' },
      { status: 500 },
    );
  }
};
