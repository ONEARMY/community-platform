import { loadStripe, type Stripe as StripeType } from '@stripe/stripe-js';
import { useContext, useEffect, useMemo, useState } from 'react';
import { TenantContext } from 'src/pages/common/TenantContext';
import { stripeService } from 'src/services/stripeService';
import type { SupporterPrice } from 'src/services/stripeService.server';
import { CheckoutView } from './CheckoutView';
import { type Interval, SupporterProvider } from './SupporterContext';
import { SupporterForm } from './SupporterForm';
import { ThankYouAccountForm } from './ThankYouAccountForm';
import { ThankYouLoginForm } from './ThankYouLoginForm';

export const CURRENCY_SYMBOLS: Record<string, string> = {
  eur: '€',
  usd: '$',
  gbp: '£',
};

export const formatAmount = (cents: number) => (cents / 100).toFixed(0);

type PageState = 'form' | 'checkout' | 'thank-you';

export const SupporterPage = ({
  prices,
  isAuthenticated,
}: {
  prices: SupporterPrice[];
  isAuthenticated: boolean;
}) => {
  const tenantContext = useContext(TenantContext);
  const siteImage = tenantContext?.siteImage;

  // Preview mode: /supporter?step=login or ?step=create
  const [previewMode] = useState(() => {
    const step = new URLSearchParams(window.location.search).get('step');
    return step === 'login' || step === 'create' ? step : null;
  });

  const [pageState, setPageState] = useState<PageState>(previewMode ? 'thank-you' : 'form');
  const [currency, setCurrency] = useState('');
  const [interval, setInterval] = useState<Interval>('month');
  const [name, setName] = useState(previewMode ? 'Test User' : '');
  const [email, setEmail] = useState(previewMode ? 'user@example.com' : '');
  const [amount, setAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [stripeInstance, setStripeInstance] = useState<Promise<StripeType | null> | null>(null);
  const [stripeCustomerId, setStripeCustomerId] = useState<string | null>(
    previewMode ? 'cus_preview' : null,
  );
  const [accountExists, setAccountExists] = useState(previewMode === 'login');

  const currencies = useMemo(() => {
    const unique = [...new Set(prices.map((p) => p.currency))];
    return unique.map((c) => ({
      value: c,
      label: `${CURRENCY_SYMBOLS[c] || c.toUpperCase()} (${c.toUpperCase()})`,
    }));
  }, [prices]);

  useEffect(() => {
    if (currencies.length && !currency) {
      setCurrency(currencies[0].value);
    }
  }, [currencies, currency]);

  const availableAmounts = useMemo(
    () =>
      prices
        .filter((p) => p.currency === currency && p.interval === interval)
        .map((p) => p.unitAmount)
        .filter((v, i, arr) => arr.indexOf(v) === i)
        .sort((a, b) => a - b),
    [prices, currency, interval],
  );

  const selectedAmount = availableAmounts.includes(amount) ? amount : availableAmounts[0] || 0;
  const symbol = CURRENCY_SYMBOLS[currency] || currency.toUpperCase();

  useEffect(() => {
    if (previewMode) return;

    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success' && !isAuthenticated) {
      const customerParam = params.get('customer');
      const emailParam = params.get('email');
      const nameParam = params.get('name');
      const accountExistsParam = params.get('accountExists');

      if (customerParam && emailParam) {
        setStripeCustomerId(customerParam);
        setEmail(emailParam);
        if (nameParam) setName(nameParam);
        if (accountExistsParam === 'true') setAccountExists(true);
        setPageState('thank-you');
        window.history.replaceState({}, '', '/supporter');
      }
    }
  }, [isAuthenticated, previewMode]);

  const handleSupport = async () => {
    if (previewMode) return;

    setIsLoading(true);
    setError(null);

    const result = await stripeService.createElementsSubscription({
      currency,
      interval,
      amount: selectedAmount,
      name,
      email,
    });

    if (result.ok) {
      setStripeInstance(loadStripe(result.publishableKey));
      setClientSecret(result.clientSecret);
      setStripeCustomerId(result.stripeCustomerId);
      setAccountExists(result.accountExists);
      setPageState('checkout');
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };

  const handlePaymentSuccess = () => {
    if (previewMode) return;

    if (isAuthenticated) {
      window.location.assign('/settings?subscription=success');
    } else {
      setPageState('thank-you');
    }
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
    amount,
    setAmount,
    name,
    setName,
    email,
    setEmail,
    currencies,
    availableAmounts,
    selectedAmount,
    symbol,
    isAuthenticated,
    isLoading,
    error,
    accountExists,
    clientSecret,
    stripeInstance,
    stripeCustomerId,
    siteImage,
    onSupport: handleSupport,
    onPaymentSuccess: handlePaymentSuccess,
    onBack: handleBack,
  };

  return (
    <SupporterProvider value={ctx}>
      {pageState === 'thank-you' && stripeCustomerId && accountExists ? (
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
