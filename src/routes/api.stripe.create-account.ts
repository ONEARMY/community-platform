import { FRIENDLY_MESSAGES } from 'oa-shared';
import type { ActionFunctionArgs } from 'react-router';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { createSupabaseAdminServerClient } from 'src/repository/supabaseAdmin.server';
import { AuthServiceServer } from 'src/services/authService.server';
import { StripeAdminService, StripeServiceServer } from 'src/services/stripeService.server';
import { methodNotAllowedError } from 'src/utils/httpException';

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== 'POST') {
    throw methodNotAllowedError();
  }

  try {
    const { email, password, name, stripeCustomerId } = await request.json();

    if (!email || !password || !name || !stripeCustomerId) {
      return Response.json(
        { error: 'Email, password, name, and stripeCustomerId are required.' },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return Response.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
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

    const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createError) {
      if (createError.message?.includes('already been registered')) {
        return Response.json({ error: FRIENDLY_MESSAGES['generic-error'] }, { status: 409 });
      }
      console.error('Error creating user:', createError);
      return Response.json({ error: 'Failed to create account.' }, { status: 500 });
    }

    const { client } = createSupabaseServerClient(request);
    const authService = new AuthServiceServer(client);
    await authService.createUserProfile({ user: newUser.user, displayName: name });

    await stripeAdmin.linkCustomerToAuthUser(stripeCustomerId, newUser.user.id, tenantId);

    // Assign badge based on active subscription's product
    const subscription = await StripeServiceServer.getSubscription(stripeCustomerId);
    if (subscription) {
      const productId = subscription.items.data[0]?.price?.product as string;
      if (productId) {
        const badgeId = await stripeAdmin.getBadgeIdForProduct(productId);
        if (badgeId) {
          await stripeAdmin.assignBadgeForSubscription(newUser.user.id, tenantId, badgeId);
        }
      }
    }

    return Response.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Error creating supporter account:', error);
    return Response.json(
      { error: error?.message || 'An unexpected error occurred.' },
      { status: 500 },
    );
  }
};
