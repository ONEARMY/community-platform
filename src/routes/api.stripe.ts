import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { updateUserActivity } from 'src/utils/activity.server';
import { stripeServiceServer } from '../services/stripeService.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);

  const claims = await client.auth.getClaims();

  if (!claims.data?.claims) {
    return Response.json({}, { headers, status: 401 });
  }

  const customerId = await stripeServiceServer.getCustomerByAuthId(claims.data.claims.sub, client);

  if (!customerId) {
    return Response.json({ hasSubscription: false }, { headers, status: 200 });
  }

  try {
    const subscription = await stripeServiceServer.getSubscription(customerId);
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
  const tenantId = process.env.TENANT_ID!;

  const claims = await client.auth.getClaims();

  if (!claims.data?.claims) {
    return Response.json({}, { headers, status: 401 });
  }

  const { data: authUser } = await client.auth.getUser();
  if (!authUser.user?.email) {
    return Response.json({}, { headers, status: 400, statusText: 'user email not found' });
  }

  try {
    const body = await request.json();
    const { action: actionType, priceId } = body;

    const customerId = await stripeServiceServer.getOrCreateCustomer(
      claims.data.claims.sub,
      authUser.user.email,
      tenantId,
      client,
    );

    const origin = new URL(request.url).origin;

    // --- Variant: Redirect ---
    if (actionType === 'checkout') {
      const stripePriceId = priceId || process.env.STRIPE_PRICE_ID;
      if (!stripePriceId) {
        return Response.json({}, { headers, status: 400, statusText: 'price ID not configured' });
      }

      const checkoutUrl = await stripeServiceServer.createCheckoutSession(
        customerId,
        stripePriceId,
        `${origin}/settings?subscription=success`,
        `${origin}/settings?subscription=cancelled`,
      );

      updateUserActivity(client, claims.data.claims.sub);

      return Response.json({ url: checkoutUrl }, { headers, status: 200 });
    }

    // --- Variant: Embedded ---
    if (actionType === 'embedded_checkout') {
      const stripePriceId = priceId || process.env.STRIPE_PRICE_ID;
      if (!stripePriceId) {
        return Response.json({}, { headers, status: 400, statusText: 'price ID not configured' });
      }

      const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
      if (!publishableKey) {
        return Response.json(
          {},
          { headers, status: 400, statusText: 'publishable key not configured' },
        );
      }

      const clientSecret = await stripeServiceServer.createEmbeddedCheckoutSession(
        customerId,
        stripePriceId,
        `${origin}/settings?subscription=success`,
      );

      updateUserActivity(client, claims.data.claims.sub);

      return Response.json({ clientSecret, publishableKey }, { headers, status: 200 });
    }

    // --- Variant: Elements ---
    if (actionType === 'elements_subscription') {
      const stripePriceId = priceId || process.env.STRIPE_PRICE_ID;
      if (!stripePriceId) {
        return Response.json({}, { headers, status: 400, statusText: 'price ID not configured' });
      }

      const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
      if (!publishableKey) {
        return Response.json(
          {},
          { headers, status: 400, statusText: 'publishable key not configured' },
        );
      }

      const clientSecret = await stripeServiceServer.createSubscriptionWithPaymentIntent(
        customerId,
        stripePriceId,
      );

      updateUserActivity(client, claims.data.claims.sub);

      return Response.json({ clientSecret, publishableKey }, { headers, status: 200 });
    }

    if (actionType === 'portal') {
      const portalUrl = await stripeServiceServer.createBillingPortalSession(
        customerId,
        `${origin}/settings`,
      );

      return Response.json({ url: portalUrl }, { headers, status: 200 });
    }

    return Response.json({}, { headers, status: 400, statusText: 'invalid action' });
  } catch (error) {
    console.error(error);
    return Response.json({}, { headers, status: 500, statusText: 'error' });
  }
};
