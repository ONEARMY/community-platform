import type { ActionFunctionArgs } from 'react-router';
import { createSupabaseAdminServerClient } from 'src/repository/supabaseAdmin.server';
import { authServiceServer } from 'src/services/authService.server';
import { stripeServiceServer } from 'src/services/stripeService.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== 'POST') {
    return Response.json({}, { status: 405, statusText: 'method not allowed' });
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

    const customer = await stripeServiceServer.getStripeCustomer(stripeCustomerId);
    if (!customer || customer.email?.toLowerCase() !== email.toLowerCase()) {
      return Response.json({ error: 'Invalid customer or email mismatch.' }, { status: 400 });
    }

    const adminClient = createSupabaseAdminServerClient();
    const tenantId = process.env.TENANT_ID!;

    const baseUsername = email
      .split('@')[0]
      .replace(/[^a-zA-Z0-9_-]/g, '')
      .slice(0, 20);
    let username = baseUsername;
    let suffix = 1;
    while (!(await authServiceServer.isUsernameAvailable(username, adminClient))) {
      username = `${baseUsername}${suffix}`;
      suffix++;
    }

    const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { username },
    });

    if (createError) {
      if (createError.message?.includes('already been registered')) {
        return Response.json(
          { error: 'An account with this email already exists. Please sign in instead.' },
          { status: 409 },
        );
      }
      console.error('Error creating user:', createError);
      return Response.json({ error: 'Failed to create account.' }, { status: 500 });
    }

    await authServiceServer.createUserProfile({ user: newUser.user, username }, adminClient);

    await stripeServiceServer.linkCustomerToAuthUser(
      stripeCustomerId,
      newUser.user.id,
      tenantId,
      adminClient,
    );

    await stripeServiceServer.updateSupporterStatus(newUser.user.id, true, adminClient);

    return Response.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Error creating supporter account:', error);
    return Response.json(
      { error: error?.message || 'An unexpected error occurred.' },
      { status: 500 },
    );
  }
};
