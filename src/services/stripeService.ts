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

type ElementsSubscriptionParams = {
  priceId: string;
  name: string;
  email: string;
};

type ElementsSubscriptionResponse =
  | {
      ok: true;
      clientSecret: string;
      publishableKey: string;
      stripeCustomerId: string;
      accountExists: boolean;
    }
  | { ok: false; error: string };

const createElementsSubscription = async (
  params: ElementsSubscriptionParams,
): Promise<ElementsSubscriptionResponse> => {
  try {
    const response = await fetch('/api/stripe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'elements_subscription', ...params }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { ok: false, error: data.error || 'Something went wrong.' };
    }

    return {
      ok: true,
      clientSecret: data.clientSecret,
      publishableKey: data.publishableKey,
      stripeCustomerId: data.stripeCustomerId,
      accountExists: data.accountExists ?? false,
    };
  } catch (error) {
    console.error(error);
    return { ok: false, error: 'Network error. Please try again.' };
  }
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

type CreateSupporterAccountParams = {
  email: string;
  password: string;
  name: string;
  stripeCustomerId: string;
};

type CreateSupporterAccountResponse = { ok: true } | { ok: false; error: string };

const createSupporterAccount = async (
  params: CreateSupporterAccountParams,
): Promise<CreateSupporterAccountResponse> => {
  try {
    const response = await fetch('/api/stripe/create-account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      return { ok: false, error: data.error || 'Something went wrong.' };
    }

    return { ok: true };
  } catch (error) {
    console.error(error);
    return { ok: false, error: 'Network error. Please try again.' };
  }
};

type LinkExistingAccountParams = {
  email: string;
  password: string;
  stripeCustomerId: string;
};

type LinkExistingAccountResponse = { ok: true } | { ok: false; error: string };

const linkExistingAccount = async (
  params: LinkExistingAccountParams,
): Promise<LinkExistingAccountResponse> => {
  try {
    const response = await fetch('/api/stripe/link-account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      return { ok: false, error: data.error || 'Something went wrong.' };
    }

    return { ok: true };
  } catch (error) {
    console.error(error);
    return { ok: false, error: 'Network error. Please try again.' };
  }
};

export const stripeService = {
  getSubscriptionStatus,
  createElementsSubscription,
  createPortalSession,
  createSupporterAccount,
  linkExistingAccount,
};
