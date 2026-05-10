import { loadStripe, type Stripe as StripeType } from '@stripe/stripe-js';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { toast as sonnerToast } from 'sonner';
import { CustomToast } from 'src/common/Toast/CustomToast';
import { useToast } from 'src/common/Toast/useToast';
import { TenantContext } from 'src/pages/common/TenantContext';
import { stripeService } from 'src/services/stripeService';
import type { SupporterPrice } from 'src/services/stripeService.server';
import { CheckoutView } from './CheckoutView';
import { type Interval, SupporterProvider } from './SupporterContext';
import { SupporterForm } from './SupporterForm';
import { ThankYouAccountForm } from './ThankYouAccountForm';
import { ThankYouAuthenticatedView } from './ThankYouAuthenticatedView';
import { ThankYouLoginForm } from './ThankYouLoginForm';

export const formatPrice = (cents: number, currency: string) =>
  new Intl.NumberFormat(navigator.language, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);

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
  isAuthenticated,
  userEmail,
}: {
  prices: SupporterPrice[];
  isAuthenticated: boolean;
  userEmail: string;
}) => {
  const tenantContext = useContext(TenantContext);
  const siteImage = tenantContext?.siteImage;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();

  // Preview mode: /supporter?step=login or ?step=create or ?step=authenticated
  const previewMode = useMemo(() => {
    const step = searchParams.get('step');
    return step === 'login' || step === 'create' || step === 'authenticated' ? step : null;
  }, [searchParams]);

  const [pageState, setPageState] = useState<PageState>(previewMode ? 'thank-you' : 'form');
  const [currency, setCurrency] = useState(
    () => [...new Set(prices.map((p) => p.currency))][0] || '',
  );
  const [interval, setInterval] = useState<Interval>('month');
  const [name, setName] = useState(previewMode ? 'Test User' : '');
  const [email, setEmail] = useState(previewMode ? 'user@example.com' : userEmail);
  const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [stripeInstance, setStripeInstance] = useState<Promise<StripeType | null> | null>(null);
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
        .sort((a, b) => a.unitAmount - b.unitAmount),
    [prices, currency, interval],
  );

  const selectedPrice =
    availablePrices.find((p) => p.id === selectedPriceId) ||
    availablePrices.find((p) => p.tier === 2) ||
    availablePrices[0];
  const selectedAmount = selectedPrice?.unitAmount || 0;
  const selectedTier = selectedPrice?.tier ?? null;
  const selectedTierName = selectedPrice?.tierName ?? null;
  const symbol = currency ? getCurrencySymbol(currency) : '';

  useEffect(() => {
    if (previewMode) return;

    if (searchParams.get('payment') !== 'success' || isAuthenticated) return;

    const customerParam = searchParams.get('customer');
    const emailParam = searchParams.get('email');
    const nameParam = searchParams.get('name');
    const accountExistsParam = searchParams.get('accountExists');

    if (!customerParam || !emailParam) return;

    setStripeCustomerId(customerParam);
    setEmail(emailParam);
    if (nameParam) setName(nameParam);

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
        if (result.ok) setAccountCreated(true);
      } catch (err) {
        console.error('Auto-create account failed:', err);
      }
    };

    autoCreate();
    setPageState('thank-you');
    navigate('/supporter', { replace: true });
  }, [isAuthenticated, previewMode, searchParams]);

  const handleSupport = async () => {
    if (previewMode) return;

    setIsLoading(true);
    setError(null);

    const result = await stripeService.createElementsSubscription({
      priceId: selectedPrice!.id,
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
    if (previewMode) return;

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
        if (result.ok) setAccountCreated(true);
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
    setInterval,
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
