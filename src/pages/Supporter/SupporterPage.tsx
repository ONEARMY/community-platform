import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe, type Stripe as StripeType } from '@stripe/stripe-js';
import { Button, Icon, Select } from 'oa-components';
import { type FormEvent, useContext, useMemo, useState } from 'react';
import { TenantContext } from 'src/pages/common/TenantContext';
import { stripeService } from 'src/services/stripeService';
import type { SupporterPrice } from 'src/services/stripeService.server';
import { Box, Card, Flex, Heading, Image, Input, Text } from 'theme-ui';

const CURRENCY_SYMBOLS: Record<string, string> = {
  eur: '€',
  usd: '$',
  gbp: '£',
};

const formatAmount = (cents: number) => (cents / 100).toFixed(0);

type Interval = 'month' | 'year';

const sectionBorder = {
  border: '1px solid',
  borderColor: 'offWhite',
  borderRadius: 2,
};

const CheckoutForm = ({
  amount,
  currency,
  interval,
}: {
  amount: number;
  currency: string;
  interval: Interval;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const symbol = CURRENCY_SYMBOLS[currency] || currency.toUpperCase();
  const label = interval === 'month' ? 'Month' : 'Year';

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/settings?subscription=success`,
      },
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(error.message || 'An unexpected error occurred.');
      setIsSubmitting(false);
    } else {
      window.location.assign('/settings?subscription=success');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <Flex sx={{ flexDirection: 'column', gap: 3 }}>
        <Heading as="h2">Payment checkout</Heading>
        <PaymentElement options={{ layout: 'tabs' }} />
        {errorMessage && <Text sx={{ color: 'red' }}>{errorMessage}</Text>}
        <Button type="submit" variant="primary" disabled={!stripe || isSubmitting}>
          {isSubmitting ? 'Processing...' : `Pay ${symbol}${formatAmount(amount)}/${label}`}
        </Button>
        <Text variant="quiet" sx={{ fontSize: 0 }}>
          By confirming your payment, you allow us to charge your payment method for this and future
          payments in accordance with our terms. You can always cancel your subscription.
        </Text>
      </Flex>
    </form>
  );
};

export const SupporterPage = ({ prices }: { prices: SupporterPrice[] }) => {
  const tenantContext = useContext(TenantContext);
  const siteImage = tenantContext?.siteImage;

  // Derive available currencies from prices
  const currencies = useMemo(() => {
    const unique = [...new Set(prices.map((p) => p.currency))];
    return unique.map((c) => ({
      value: c,
      label: `${CURRENCY_SYMBOLS[c] || c.toUpperCase()} (${c.toUpperCase()})`,
    }));
  }, [prices]);

  const defaultCurrency = currencies[0]?.value || 'eur';

  const [currency, setCurrency] = useState(defaultCurrency);
  const [interval, setInterval] = useState<Interval>('month');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [stripeInstance, setStripeInstance] = useState<Promise<StripeType | null> | null>(null);

  // Filter prices for current currency + interval
  const availableAmounts = useMemo(
    () =>
      prices
        .filter((p) => p.currency === currency && p.interval === interval)
        .map((p) => p.unitAmount)
        .filter((v, i, arr) => arr.indexOf(v) === i)
        .sort((a, b) => a - b),
    [prices, currency, interval],
  );

  const [amount, setAmount] = useState(() => availableAmounts[0] || 0);

  // Reset amount when currency/interval changes and current amount isn't available
  const selectedAmount = availableAmounts.includes(amount) ? amount : availableAmounts[0] || 0;

  const symbol = CURRENCY_SYMBOLS[currency] || currency.toUpperCase();
  const label = interval === 'month' ? 'month' : 'year';

  const handleSupport = async () => {
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
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };

  const showCheckout = clientSecret && stripeInstance;

  return (
    <Flex
      sx={{
        flexDirection: 'column',
        maxWidth: 480,
        mx: 'auto',
        my: [3, 5],
        px: [3, 0],
      }}
    >
      {/* Logo icons - behind card border */}
      <Flex
        sx={{
          justifyContent: 'center',
          alignItems: 'flex-end',
          mb: '-15px',
          position: 'relative',
          zIndex: 0,
        }}
      >
        <Icon glyph="supporter" size={80} />
        {siteImage && <Image src={siteImage} sx={{ width: 90, height: 90 }} alt="Site logo" />}
      </Flex>

      {showCheckout ? (
        <Card sx={{ padding: 4, position: 'relative', zIndex: 1, ...sectionBorder }}>
          <Elements stripe={stripeInstance} options={{ clientSecret }}>
            <CheckoutForm amount={selectedAmount} currency={currency} interval={interval} />
          </Elements>
        </Card>
      ) : (
        <Card
          sx={{
            bg: 'white',
            border: '2px solid',
            borderColor: 'softblue',
            borderRadius: 3,
            padding: 4,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Flex sx={{ flexDirection: 'column', gap: 3 }}>
            <Heading as="h1" sx={{ fontSize: [4, 5] }}>
              Become a supporter
            </Heading>

            {/* Currency select */}
            <Box sx={{ ...sectionBorder, padding: 3 }}>
              <Text variant="quiet" sx={{ fontSize: 0, mb: 1 }}>
                Payment currency
              </Text>
              <Select
                variant="form"
                options={currencies}
                value={currencies.find((c) => c.value === currency)}
                onChange={(option: any) => option && setCurrency(option.value)}
              />
            </Box>

            {/* Interval toggle */}
            <Flex sx={{ gap: 0 }}>
              <Box
                as="button"
                onClick={() => setInterval('month')}
                sx={{
                  flex: 1,
                  py: 2,
                  px: 3,
                  border: '2px solid',
                  borderColor: interval === 'month' ? 'green' : 'offWhite',
                  borderRadius: '8px 0 0 8px',
                  bg: 'white',
                  color: 'black',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: 2,
                  textAlign: 'center',
                  fontFamily: 'body',
                }}
              >
                Monthly
              </Box>
              <Box
                as="button"
                onClick={() => setInterval('year')}
                sx={{
                  flex: 1,
                  py: 2,
                  px: 3,
                  border: '2px solid',
                  borderColor: interval === 'year' ? 'green' : 'offWhite',
                  borderRadius: '0 8px 8px 0',
                  bg: 'white',
                  color: 'black',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: 2,
                  textAlign: 'center',
                  fontFamily: 'body',
                }}
              >
                Yearly
              </Box>
            </Flex>

            {/* Amount section */}
            <Box sx={{ ...sectionBorder, padding: 3 }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 2,
                }}
              >
                {availableAmounts.map((preset) => (
                  <Box
                    key={preset}
                    as="button"
                    onClick={() => setAmount(preset)}
                    sx={{
                      py: 2,
                      px: 3,
                      border: '2px solid',
                      borderColor: selectedAmount === preset ? 'green' : 'offWhite',
                      borderRadius: 2,
                      bg: 'white',
                      cursor: 'pointer',
                      fontWeight: selectedAmount === preset ? 'bold' : 'normal',
                      fontSize: 2,
                      textAlign: 'center',
                      fontFamily: 'body',
                      '&:hover': { borderColor: 'green' },
                    }}
                  >
                    {symbol}
                    {formatAmount(preset)}
                  </Box>
                ))}
              </Box>

              {/* Amount summary */}
              <Flex
                sx={{
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  mt: 3,
                  bg: 'background',
                  borderRadius: 2,
                  px: 3,
                  py: 3,
                }}
              >
                <Text sx={{ fontSize: 4, fontWeight: 'bold' }}>
                  {symbol} {formatAmount(selectedAmount)}
                </Text>
                <Text variant="quiet">per {label}</Text>
              </Flex>
            </Box>

            {/* Name & Email */}
            <Flex sx={{ flexDirection: 'column', gap: 2 }}>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                sx={{
                  border: '1px solid',
                  borderColor: 'offWhite',
                  borderRadius: 1,
                  px: 3,
                  py: 3,
                  bg: 'background',
                  '&:focus': { outline: 'none', borderColor: 'green' },
                }}
              />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                sx={{
                  border: '1px solid',
                  borderColor: 'offWhite',
                  borderRadius: 1,
                  px: 3,
                  py: 3,
                  bg: 'background',
                  '&:focus': { outline: 'none', borderColor: 'green' },
                }}
              />
            </Flex>

            {error && <Text sx={{ color: 'red' }}>{error}</Text>}

            {/* CTA */}
            <Button
              type="button"
              variant="primary"
              onClick={handleSupport}
              disabled={isLoading || !selectedAmount}
            >
              {isLoading
                ? 'Processing...'
                : `Support ${symbol}${formatAmount(selectedAmount)}/${label === 'month' ? 'Month' : 'Year'}`}
            </Button>

            {/* Terms */}
            <Text variant="quiet" sx={{ fontSize: 0 }}>
              By continuing, you agree to the{' '}
              <a href="/terms" target="_blank" rel="noopener noreferrer">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>
            </Text>
          </Flex>
        </Card>
      )}
    </Flex>
  );
};
