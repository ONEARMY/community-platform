import type { ActionFunctionArgs } from 'react-router';
import { createSupabaseAdminServerClient } from 'src/repository/supabaseAdmin.server';
import { StripeServiceServer } from 'src/services/stripeService.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== 'POST') {
    return Response.json({}, { status: 405, statusText: 'method not allowed' });
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

    const customer = await stripeService.getStripeCustomer(stripeCustomerId);
    if (!customer || customer.email?.toLowerCase() !== email.toLowerCase()) {
      return Response.json({ error: 'Invalid customer or email mismatch.' }, { status: 400 });
    }

    const linkedAuthId = await stripeService.getAuthIdByStripeCustomerId(stripeCustomerId);
    if (!linkedAuthId) {
      return Response.json(
        { error: 'No linked account found for this customer.' },
        { status: 404 },
      );
    }

    const { error: updateError } = await adminClient.auth.admin.updateUserById(linkedAuthId, {
      password,
    });

    if (updateError) {
      console.error('Error updating password:', updateError);
      return Response.json({ error: 'Failed to update password.' }, { status: 500 });
    }

    return Response.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Error setting password:', error);
    return Response.json(
      { error: error?.message || 'An unexpected error occurred.' },
      { status: 500 },
    );
  }
};
