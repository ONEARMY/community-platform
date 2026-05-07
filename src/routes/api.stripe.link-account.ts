import type { ActionFunctionArgs } from 'react-router';
import { createSupabaseAdminServerClient } from 'src/repository/supabaseAdmin.server';
import { StripeAdminService, StripeServiceServer } from 'src/services/stripeService.server';
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

    // Assign badge based on active subscription's product
    const subscription = await StripeServiceServer.getSubscription(stripeCustomerId);
    if (subscription) {
      const productId = subscription.items.data[0]?.price?.product as string;
      if (productId) {
        const badgeId = await stripeAdmin.getBadgeIdForProduct(productId);
        if (badgeId) {
          await stripeAdmin.assignBadgeForSubscription(signInData.user.id, tenantId, badgeId);
        }
      }
    }

    return Response.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Error linking supporter account:', error);
    return Response.json(
      { error: error?.message || 'An unexpected error occurred.' },
      { status: 500 },
    );
  }
};
