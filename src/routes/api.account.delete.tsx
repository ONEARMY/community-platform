import { HTTPException } from 'hono/http-exception';
import { type ActionFunctionArgs, data } from 'react-router';
import { logger } from 'src/logger';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { createSupabaseAdminServerClient } from 'src/repository/supabaseAdmin.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { StripeServiceServer } from 'src/services/stripeService.server';
import { unauthorizedError, validationError } from 'src/utils/httpException';

export const action = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);
  const adminClient = createSupabaseAdminServerClient();

  try {
    const formData = await request.formData();
    const password = formData.get('password') as string;

    if (!password) {
      throw validationError('Password is required', 'password');
    }

    const claims = await client.auth.getClaims();
    const authId = claims.data?.claims?.sub;

    if (!authId) {
      throw unauthorizedError();
    }

    // Verify password
    const signInResult = await adminClient.auth.signInWithPassword({
      email: claims.data?.claims?.email as string,
      password,
    });

    if (signInResult.error) {
      console.error(signInResult.error);
      throw validationError('Invalid password', 'password');
    }

    const profileService = new ProfileServiceServer(client);
    const profile = await profileService.getByAuthId(authId);

    if (!profile) {
      throw validationError('Profile not found', 'profile');
    }

    // Check if user has profiles on other tenants
    const { data: allProfiles } = await adminClient
      .from('profiles')
      .select('id, tenant_id')
      .eq('auth_id', authId);

    const hasOtherTenantProfiles = (allProfiles?.length ?? 0) > 1;

    // Cancel this tenant's subscription — the only Stripe account this deployment has keys for.
    const stripeService = new StripeServiceServer(client);
    const customerId = await stripeService.getCustomerByAuthId(authId);
    if (customerId) {
      await StripeServiceServer.cancelActiveSubscriptions(customerId);
    }

    if (hasOtherTenantProfiles) {
      // Other tenant profiles exist, so only remove this tenant's data.
      const { error } = await client.from('profiles').delete().eq('id', profile.id);

      if (error) {
        throw error;
      }

      await client.from('stripe_customers').delete().eq('auth_id', authId);
    } else {
      // Last profile: delete the auth user, which cascades the stripe_customers rows.
      const { error } = await adminClient.auth.admin.deleteUser(authId);

      if (error) {
        throw error;
      }
    }

    // Sign out the user
    await client.auth.signOut();

    return new Response(null, { headers, status: 204 });
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    logger.error(error);
    return data(
      { error: 'Failed to delete account' },
      { headers, status: 500, statusText: 'Failed to delete account' },
    );
  }
};
