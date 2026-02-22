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
  createPortalSession,
};
