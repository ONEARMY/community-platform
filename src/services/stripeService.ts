export type SubscriptionStatus = {
  hasSubscription: boolean;
  subscription: {
    status: string;
    cancelAtPeriodEnd: boolean;
    cancelAt: number | null;
  } | null;
};

const getSubscriptionStatus = async (): Promise<SubscriptionStatus | null> => {
  try {
    const response = await fetch('/api/stripe');
    return (await response.json()) as SubscriptionStatus;
  } catch (error) {
    console.error(error);
  }

  return null;
};

// --- Variant: Redirect ---
const createCheckoutSession = async (): Promise<string | null> => {
  try {
    const response = await fetch('/api/stripe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'checkout' }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error(error);
  }

  return null;
};

type EmbeddedCheckoutResult = {
  clientSecret: string;
  publishableKey: string;
};

// --- Variant: Embedded ---
const createEmbeddedCheckoutSession = async (): Promise<EmbeddedCheckoutResult | null> => {
  try {
    const response = await fetch('/api/stripe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'embedded_checkout' }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return { clientSecret: data.clientSecret, publishableKey: data.publishableKey };
  } catch (error) {
    console.error(error);
  }

  return null;
};

// --- Variant: Elements ---
const createElementsSubscription = async (): Promise<EmbeddedCheckoutResult | null> => {
  try {
    const response = await fetch('/api/stripe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'elements_subscription' }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return { clientSecret: data.clientSecret, publishableKey: data.publishableKey };
  } catch (error) {
    console.error(error);
  }

  return null;
};

const createPortalSession = async (): Promise<string | null> => {
  try {
    const response = await fetch('/api/stripe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'portal' }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error(error);
  }

  return null;
};

export const stripeService = {
  getSubscriptionStatus,
  createCheckoutSession,
  createEmbeddedCheckoutSession,
  createElementsSubscription,
  createPortalSession,
};
