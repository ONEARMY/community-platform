import type { ActionFunctionArgs } from 'react-router';
import { createSupabaseAdminServerClient } from 'src/repository/supabaseAdmin.server';
import { stripeServiceServer } from 'src/services/stripeService.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== 'POST') {
    return Response.json({}, { status: 405, statusText: 'method not allowed' });
  }

  try {
    const { email, password, stripeCustomerId } = await request.json();

    if (!email || !password || !stripeCustomerId) {
      return Response.json(
        { error: 'Email, password, and stripeCustomerId are required.' },
        { status: 400 },
      );
    }

    const customer = await stripeServiceServer.getStripeCustomer(stripeCustomerId);
    if (!customer || customer.email?.toLowerCase() !== email.toLowerCase()) {
      return Response.json({ error: 'Invalid customer or email mismatch.' }, { status: 400 });
    }

    const adminClient = createSupabaseAdminServerClient();
    const tenantId = process.env.TENANT_ID!;

    const { data: signInData, error: signInError } = await adminClient.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !signInData.user) {
      return Response.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    await stripeServiceServer.linkCustomerToAuthUser(
      stripeCustomerId,
      signInData.user.id,
      tenantId,
      adminClient,
    );

    await stripeServiceServer.updateSupporterStatus(signInData.user.id, true, adminClient);

    return Response.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Error linking supporter account:', error);
    return Response.json(
      { error: error?.message || 'An unexpected error occurred.' },
      { status: 500 },
    );
  }
};
