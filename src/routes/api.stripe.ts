import { FRIENDLY_MESSAGES } from 'oa-shared';
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { getSecret } from 'src/services/secretsService.server';
import { StripeServiceServer } from '../services/stripeService.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);

  const claims = await client.auth.getClaims();

  if (!claims.data?.claims) {
    return Response.json({}, { headers, status: 401 });
  }

  const stripeService = new StripeServiceServer(client);
  const customerId = await stripeService.getCustomerByAuthId(claims.data.claims.sub);

  if (!customerId) {
    return Response.json({ hasSubscription: false }, { headers, status: 200 });
  }

  try {
    const subscription = await stripeService.getSubscription(customerId);
    return Response.json(
      {
        hasSubscription: !!subscription,
        subscription: subscription
          ? {
              status: subscription.status,
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
              cancelAt: subscription.cancel_at,
            }
          : null,
      },
      { headers, status: 200 },
    );
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return Response.json({ hasSubscription: false }, { headers, status: 200 });
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== 'POST') {
    return Response.json({}, { status: 405, statusText: 'method not allowed' });
  }

  const { client, headers } = createSupabaseServerClient(request);
  const tenantId = process.env.TENANT_ID;
  if (!tenantId) {
    return Response.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const body = await request.json();
  const { action: actionType, priceId, name, email } = body;

  const claims = await client.auth.getClaims();
  const isAuthenticated = !!claims.data?.claims;

  // All actions except elements_subscription require auth
  if (!isAuthenticated && actionType !== 'elements_subscription') {
    return Response.json({}, { headers, status: 401 });
  }

  const stripeService = new StripeServiceServer(client);

  try {
    if (actionType === 'elements_subscription') {
      if (!priceId) {
        return Response.json({}, { headers, status: 400, statusText: 'priceId is required' });
      }

      const publishableKey = await getSecret('STRIPE_PUBLISHABLE_KEY');

      let customerId: string;
      let accountExists = false;

      if (isAuthenticated) {
        const { data: authUser } = await client.auth.getUser();
        if (!authUser.user?.email) {
          return Response.json({}, { headers, status: 400, statusText: 'user email not found' });
        }

        const existingCustomerId = await stripeService.getCustomerByAuthId(
          claims.data!.claims!.sub,
        );
        if (existingCustomerId) {
          const existingSub = await stripeService.getSubscription(existingCustomerId);
          if (existingSub) {
            return Response.json(
              {
                error: FRIENDLY_MESSAGES['generic-error'],
              },
              { headers, status: 409 },
            );
          }
          customerId = existingCustomerId;
        } else {
          customerId = await stripeService.createCustomer(
            claims.data!.claims!.sub,
            authUser.user.email,
            tenantId,
          );
        }
        new ProfileServiceServer(client).updateUserActivity(claims.data!.claims!.sub);
      } else {
        if (!email) {
          return Response.json(
            {},
            { headers, status: 400, statusText: 'email is required for guest checkout' },
          );
        }

        const { data: existingUser } = await client.rpc('get_user_id_by_email', {
          email,
        });
        accountExists = Array.isArray(existingUser) && existingUser.length > 0;

        if (accountExists && existingUser) {
          const userId = existingUser[0].id;
          const existingCustomerId = await stripeService.getCustomerByAuthId(userId);
          if (existingCustomerId) {
            const existingSub = await stripeService.getSubscription(existingCustomerId);
            if (existingSub) {
              return Response.json(
                {
                  error: FRIENDLY_MESSAGES['generic-error'],
                },
                { headers, status: 409 },
              );
            }
          }
        }

        customerId = await stripeService.createGuestCustomer(email, name);
      }

      const clientSecret = await stripeService.createSubscriptionWithPaymentIntent(
        customerId,
        priceId,
        name,
      );

      return Response.json(
        { clientSecret, publishableKey, stripeCustomerId: customerId, accountExists },
        { headers, status: 200 },
      );
    }

    const { data: authUser } = await client.auth.getUser();
    if (!authUser.user?.email) {
      return Response.json({}, { headers, status: 400, statusText: 'user email not found' });
    }

    const customerId = await stripeService.getOrCreateCustomer(
      claims.data!.claims!.sub,
      authUser.user.email,
      tenantId,
    );

    const origin = new URL(request.url).origin;

    if (actionType === 'portal') {
      const portalUrl = await stripeService.createBillingPortalSession(
        customerId,
        `${origin}/settings`,
      );

      return Response.json({ url: portalUrl }, { headers, status: 200 });
    }

    return Response.json({}, { headers, status: 400, statusText: 'invalid action' });
  } catch (error: any) {
    console.error(error);
    const message = error?.message || 'An unexpected error occurred';
    return Response.json({ error: message }, { headers, status: 500 });
  }
};
