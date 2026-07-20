import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { type FormEvent, useState } from 'react';
import { Box, Flex, Link, Text } from 'theme-ui';
import { SupporterCard } from './SupporterCard';
import { useSupporterContext } from './SupporterContext';
import { SupporterCTA } from './SupporterCTA';
import { formatPrice } from './SupporterPage';
import { TierBanner } from './TierBanner';

const CheckoutForm = () => {
  const {
    selectedAmount,
    currency,
    interval,
    isAuthenticated,
    stripeCustomerId,
    email: guestEmail,
    name: guestName,
    accountExists,
    onPaymentSuccess,
    selectedTier,
    tierConfig,
  } = useSupporterContext();

  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const label = interval === 'month' ? 'month' : 'year';
  const currentTierConfig = selectedTier != null ? tierConfig[selectedTier] : null;
  const tierColor = currentTierConfig?.color || '#BFDEBA';
  const disabled = !stripe || isSubmitting;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    let returnUrl: string;
    if (isAuthenticated) {
      returnUrl = `${window.location.origin}/settings/account`;
    } else {
      const params = new URLSearchParams({
        payment: 'success',
        ...(stripeCustomerId && { customer: stripeCustomerId }),
        ...(guestEmail && { email: guestEmail }),
        ...(guestName && { name: guestName }),
        ...(accountExists && { accountExists: 'true' }),
      });
      returnUrl = `${window.location.origin}/support?${params.toString()}`;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
      },
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(error.message || 'An unexpected error occurred.');
      setIsSubmitting(false);
    } else {
      onPaymentSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <Flex sx={{ flexDirection: 'column', gap: '30px' }}>
        {selectedTier != null && currentTierConfig && (
          <TierBanner tier={selectedTier} tierConfig={currentTierConfig} tierColor={tierColor} />
        )}

        <Text sx={{ fontSize: '14px', lineHeight: 1.4, color: 'darkGrey' }}>
          You can cancel, pause or update your subscription at any time.
        </Text>

        <PaymentElement options={{ layout: 'tabs' }} />

        {errorMessage && <Text sx={{ color: 'red' }}>{errorMessage}</Text>}

        <Flex
          sx={{
            flexDirection: 'column',
            alignItems: 'center',
            gap: '15px',
            alignSelf: 'stretch',
          }}
        >
          <SupporterCTA type="submit" disabled={disabled} color={tierColor}>
            {isSubmitting
              ? 'Processing...'
              : `Pay ${formatPrice(selectedAmount, currency)}/${label}  →`}
          </SupporterCTA>

          <Text sx={{ fontSize: '12px', lineHeight: 1.4, color: 'darkGrey', textAlign: 'center' }}>
            By confirming your payment, you allow us to charge your payment method for this and
            future payments in accordance with our{' '}
            <Link
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: 'inherit', textDecoration: 'underline' }}
            >
              Terms of Service
            </Link>
            . You can always cancel your subscription.
          </Text>
        </Flex>
      </Flex>
    </form>
  );
};

export const CheckoutView = () => {
  const { stripeInstance, clientSecret, siteImage, siteName, onBack } = useSupporterContext();

  if (!stripeInstance || !clientSecret) {
    return null;
  }

  return (
    <Flex
      sx={{
        flexDirection: 'column',
        maxWidth: '580px',
        width: '100%',
        mx: 'auto',
        my: [3, 5],
        px: [3, 0],
      }}
    >
      <Box
        as="button"
        onClick={onBack}
        sx={{
          alignSelf: 'flex-start',
          bg: 'transparent',
          border: 'none',
          p: 0,
          cursor: 'pointer',
          fontSize: '16px',
          fontFamily: 'body',
          color: 'black',
          mb: 3,
          '&:hover': { opacity: 0.7 },
        }}
      >
        ← Back
      </Box>

      <SupporterCard
        siteImage={siteImage}
        heading={siteName ? `${siteName} Membership` : 'Checkout'}
      >
        <Elements
          stripe={stripeInstance}
          options={{
            clientSecret,
            appearance: {
              theme: 'flat',
              variables: {
                colorBackground: '#ffffff',
                borderRadius: '4px',
              },
              rules: {
                '.Input': {
                  border: '1px solid #e0e0e0',
                  boxShadow: 'none',
                },
                '.Input:focus': {
                  border: '1px solid #000',
                  boxShadow: 'none',
                },
                '.Tab': {
                  border: '1px solid #e0e0e0',
                  boxShadow: 'none',
                },
                '.Tab--selected': {
                  border: '1px solid #000',
                  boxShadow: 'none',
                },
              },
            },
          }}
        >
          <CheckoutForm />
        </Elements>
      </SupporterCard>
    </Flex>
  );
};
