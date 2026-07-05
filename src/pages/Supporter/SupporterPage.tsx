import { loadStripe, type Stripe as StripeType } from '@stripe/stripe-js';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { toast as sonnerToast } from 'sonner';
import { CustomToast } from 'src/common/Toast/CustomToast';
import { useToast } from 'src/common/Toast/useToast';
import { TenantContext } from 'src/pages/common/TenantContext';
import { stripeService } from 'src/services/stripeService';
import type { SupporterPrice, TierConfigMap } from 'src/services/stripeService.server';
import { CheckoutView } from './CheckoutView';
import { type Interval, SupporterProvider } from './SupporterContext';
import { SupporterForm } from './SupporterForm';
import { ThankYouAccountForm } from './ThankYouAccountForm';
import { ThankYouAuthenticatedView } from './ThankYouAuthenticatedView';
import { ThankYouLoginForm } from './ThankYouLoginForm';
import { TIER_CONFIG } from './tierConfig';

export const formatPrice = (cents: number, currency: string) => {
  const fractionDigits = cents % 100 === 0 ? 0 : 2;
  return new Intl.NumberFormat(navigator.language, {
    style: 'currency',
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(cents / 100);
};

export const getCurrencySymbol = (currency: string) =>
  new Intl.NumberFormat(navigator.language, {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
  })
    .formatToParts(0)
    .find((p) => p.type === 'currency')?.value || currency.toUpperCase();

type PageState = 'form' | 'checkout' | 'thank-you';

export const SupporterPage = ({
  prices,
  tierConfig: dbTierConfig,
  isAuthenticated,
  userEmail,
}: {
  prices: SupporterPrice[];
  tierConfig?: TierConfigMap;
  isAuthenticated: boolean;
  userEmail: string;
}) => {
  const tenantContext = useContext(TenantContext);
  const siteImage = tenantContext?.siteImage;
  const siteName = tenantContext?.siteNameShort || tenantContext?.siteName;

  const tierConfig = useMemo(() => {
    const merged = { ...TIER_CONFIG };
    if (dbTierConfig) {
      for (const [key, value] of Object.entries(dbTierConfig)) {
        merged[Number(key)] = value;
      }
    }
    return merged;
  }, [dbTierConfig]);
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();

  // Preview mode: /support?preview=form|checkout|login|create|authenticated
  const previewMode = useMemo(() => {
    const preview = searchParams.get('preview');
    return preview === 'form' ||
      preview === 'checkout' ||
      preview === 'login' ||
      preview === 'create' ||
      preview === 'authenticated'
      ? preview
      : null;
  }, [searchParams]);

  const [initialTier] = useState(() => {
    const tier = searchParams.get('tier');
    return tier ? parseInt(tier, 10) : null;
  });

  const [pageState, setPageState] = useState<PageState>(
    previewMode === 'checkout'
      ? 'checkout'
      : previewMode === 'login' || previewMode === 'create' || previewMode === 'authenticated'
        ? 'thank-you'
        : 'form',
  );
  const [currency, setCurrency] = useState(
    () => [...new Set(prices.map((p) => p.currency))][0] || '',
  );
  const [interval, setInterval] = useState<Interval>('month');
  const [name, setName] = useState(previewMode ? 'Test User' : '');
  const [email, setEmail] = useState(previewMode ? 'user@example.com' : userEmail);
  const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(
    previewMode === 'checkout' ? 'pi_preview_secret' : null,
  );
  const [stripeInstance, setStripeInstance] = useState<Promise<StripeType | null> | null>(
    previewMode === 'checkout' ? Promise.resolve(null) : null,
  );
  const [stripeCustomerId, setStripeCustomerId] = useState<string | null>(
    previewMode ? 'cus_preview' : null,
  );
  const [accountExists, setAccountExists] = useState(previewMode === 'login');
  const [accountCreated, setAccountCreated] = useState(false);

  const currencies = useMemo(() => {
    const unique = [...new Set(prices.map((p) => p.currency))];
    return unique.map((c) => ({
      value: c,
      label: `${new Intl.DisplayNames(navigator.language, { type: 'currency' }).of(c.toUpperCase())} (${c.toUpperCase()})`,
    }));
  }, [prices]);

  const availablePrices = useMemo(
    () =>
      prices
        .filter((p) => p.currency === currency && p.interval === interval)
        .sort((a, b) => (b.tier ?? 0) - (a.tier ?? 0) || b.unitAmount - a.unitAmount),
    [prices, currency, interval],
  );

  const handleIntervalChange = useCallback(
    (newInterval: Interval) => {
      const currentIndex = availablePrices.findIndex((p) => p.id === selectedPriceId);
      const newPrices = prices
        .filter((p) => p.currency === currency && p.interval === newInterval)
        .sort((a, b) => (b.tier ?? 0) - (a.tier ?? 0) || b.unitAmount - a.unitAmount);
      if (currentIndex >= 0 && currentIndex < newPrices.length) {
        setSelectedPriceId(newPrices[currentIndex].id);
      }
      setInterval(newInterval);
    },
    [availablePrices, selectedPriceId, prices, currency],
  );

  const selectedPrice =
    availablePrices.find((p) => p.id === selectedPriceId) ||
    (initialTier != null ? availablePrices.findLast((p) => p.tier === initialTier) : null) ||
    availablePrices.findLast((p) => p.tier === 2) ||
    availablePrices[0];
  const selectedAmount = selectedPrice?.unitAmount || 0;
  const selectedTier = selectedPrice?.tier ?? null;
  const selectedTierName = selectedPrice?.tierName ?? null;
  const symbol = currency ? getCurrencySymbol(currency) : '';

  useEffect(() => {
    if (!previewMode && !searchParams.has('payment')) {
      setSearchParams({ step: pageState }, { replace: true });
    }
  }, [pageState]);

  useEffect(() => {
    if (previewMode) {
      return;
    }

    if (searchParams.get('payment') !== 'success' || isAuthenticated) {
      return;
    }

    const customerParam = searchParams.get('customer');
    const emailParam = searchParams.get('email');
    const nameParam = searchParams.get('name');
    const accountExistsParam = searchParams.get('accountExists');

    if (!customerParam || !emailParam) {
      return;
    }

    setStripeCustomerId(customerParam);
    setEmail(emailParam);
    if (nameParam) {
      setName(nameParam);
    }

    const autoCreate = async () => {
      if (accountExistsParam === 'true') {
        setAccountExists(true);
        return;
      }

      try {
        const result = await stripeService.createSupporterAccount({
          email: emailParam,
          password: crypto.randomUUID(),
          name: nameParam || emailParam.split('@')[0],
          stripeCustomerId: customerParam,
        });
        if (result.ok) {
          setAccountCreated(true);
        }
      } catch (err) {
        console.error('Auto-create account failed:', err);
      }
    };

    autoCreate();
    setPageState('thank-you');
    setSearchParams({ step: 'thank-you' }, { replace: true });
  }, [isAuthenticated, previewMode, searchParams]);

  const handleSupport = async () => {
    if (previewMode) {
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await stripeService.createElementsSubscription({
      priceId: selectedPrice!.id,
      currency,
      name,
      email,
    });

    if (result.ok) {
      setStripeInstance(loadStripe(result.publishableKey));
      setClientSecret(result.clientSecret);
      setStripeCustomerId(result.stripeCustomerId);
      setAccountExists(result.accountExists);
      setPageState('checkout');
    } else if (result.error.includes('active subscription')) {
      if (isAuthenticated) {
        sonnerToast.custom(
          (toastId) => (
            // might not need a custom one, just didn't want to apply custom styling / nowrap without knowing what all will be impacted yet
            <CustomToast
              message="You're already a supporter."
              description="Manage your support"
              type="warning"
              actionLink={{
                href: '/settings/account',
                label: 'Manage',
              }}
              toastId={toastId}
            />
          ),
          { unstyled: true, style: { whiteSpace: 'nowrap' } },
        );
      } else {
        toast.warning("You're already a supporter.", {
          actionLink: {
            href: `/sign-in?returnUrl=${encodeURIComponent('/settings')}`,
            label: 'Log in',
          },
          description: 'Log in to manage your account.',
        });
      }
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };

  const handlePaymentSuccess = async () => {
    if (previewMode) {
      return;
    }

    if (isAuthenticated) {
      setPageState('thank-you');
      return;
    }

    if (!accountExists && stripeCustomerId) {
      try {
        const result = await stripeService.createSupporterAccount({
          email,
          password: crypto.randomUUID(),
          name: name || email.split('@')[0],
          stripeCustomerId,
        });
        if (result.ok) {
          setAccountCreated(true);
        }
      } catch (err) {
        console.error('Auto-create account failed:', err);
      }
    }

    setPageState('thank-you');
  };

  const handleBack = () => {
    setPageState('form');
    setClientSecret(null);
    setStripeInstance(null);
  };

  const ctx = {
    currency,
    setCurrency,
    interval,
    setInterval: handleIntervalChange,
    selectedPriceId: selectedPrice?.id || null,
    setSelectedPriceId,
    name,
    setName,
    email,
    setEmail,
    currencies,
    availablePrices,
    selectedAmount,
    selectedTier,
    selectedTierName,
    symbol,
    isAuthenticated,
    isLoading,
    error,
    accountExists,
    accountCreated,
    clientSecret,
    stripeInstance,
    stripeCustomerId,
    siteImage,
    tierConfig,
    siteName,
    previewMode: !!previewMode,
    onSupport: handleSupport,
    onPaymentSuccess: handlePaymentSuccess,
    onBack: handleBack,
  };

  return (
    <SupporterProvider value={ctx}>
      {pageState === 'thank-you' && (isAuthenticated || previewMode === 'authenticated') ? (
        <ThankYouAuthenticatedView />
      ) : pageState === 'thank-you' && stripeCustomerId && accountExists ? (
        <ThankYouLoginForm />
      ) : pageState === 'thank-you' && stripeCustomerId ? (
        <ThankYouAccountForm />
      ) : pageState === 'checkout' && clientSecret && stripeInstance ? (
        <CheckoutView />
      ) : (
        <SupporterForm />
      )}
    </SupporterProvider>
  );
};
