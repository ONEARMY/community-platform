import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { type FormEvent, useState } from 'react';
import { Box, Card, Flex, Heading, Image, Link, Text } from 'theme-ui';
import { useSupporterContext } from './SupporterContext';
import { formatPrice } from './SupporterPage';
import { TierStarIcon } from './TierStarIcons';

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
      returnUrl = `${window.location.origin}/settings?subscription=success`;
    } else {
      const params = new URLSearchParams({
        payment: 'success',
        ...(stripeCustomerId && { customer: stripeCustomerId }),
        ...(guestEmail && { email: guestEmail }),
        ...(guestName && { name: guestName }),
        ...(accountExists && { accountExists: 'true' }),
      });
      returnUrl = `${window.location.origin}/supporter?${params.toString()}`;
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
          <Flex
            sx={{
              bg: `color-mix(in srgb, ${tierColor} 50%, transparent)`,
              borderRadius: '14px',
              px: '24px',
              py: '12px',
              minHeight: '100px',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '18px',
              alignSelf: 'stretch',
            }}
          >
            <Flex sx={{ flexDirection: 'column', gap: '4px' }}>
              <Text sx={{ fontWeight: 500, fontSize: '22px' }}>
                {currentTierConfig.name} Membership
              </Text>
              <Text sx={{ fontSize: '14px', lineHeight: 1.4, color: '#696969' }}>
                {currentTierConfig.description}
              </Text>
            </Flex>
            <Box
              sx={{
                flexShrink: 0,
                width: '100px',
                height: '77px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TierStarIcon tier={selectedTier} />
            </Box>
          </Flex>
        )}

        <Text sx={{ fontSize: '14px', lineHeight: 1.4, color: '#696969' }}>
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
          <Box
            as="button"
            sx={{
              width: '100%',
              height: '64px',
              borderRadius: '5px',
              border: 'none',
              bg: tierColor,
              color: 'black',
              fontSize: '22px',
              fontWeight: 500,
              fontFamily: 'inherit',
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.6 : 1,
              transition: 'background-color 0.15s, color 0.15s',
              '&:hover:not(:disabled)': {
                bg: 'black',
                color: 'white',
              },
            }}
          >
            {isSubmitting
              ? 'Processing...'
              : `Pay ${formatPrice(selectedAmount, currency)}/${label}  →`}
          </Box>

          <Text sx={{ fontSize: '12px', lineHeight: 1.4, color: '#696969', textAlign: 'center' }}>
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

  if (!stripeInstance || !clientSecret) return null;

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

      {siteImage && (
        <Flex sx={{ justifyContent: 'center', mb: '-34px', position: 'relative', zIndex: 1 }}>
          <Image
            src={siteImage}
            sx={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }}
            alt="Site logo"
          />
        </Flex>
      )}

      <Card
        sx={{
          borderRadius: '15px',
          border: '1px solid rgba(27, 27, 27, 0.09)',
          boxShadow: '0px 44px 54px rgba(0, 0, 0, 0.06)',
          px: ['64px'],
          pt: siteImage ? '40px' : '50px',
          pb: '64px',
        }}
      >
        <Flex sx={{ flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
          <Heading
            as="h1"
            sx={{
              fontSize: '28px',
              textAlign: 'center',
              letterSpacing: '-0.01em',
              maxWidth: '300px',
            }}
          >
            {siteName ? `${siteName} Membership` : 'Checkout'}
          </Heading>

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
        </Flex>
      </Card>
    </Flex>
  );
};
