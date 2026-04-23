import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Button, Icon } from 'oa-components';
import { type FormEvent, useState } from 'react';
import { Box, Card, Flex, Heading, Text } from 'theme-ui';
import { useSupporterContext } from './SupporterContext';
import { formatPrice } from './SupporterPage';

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
  } = useSupporterContext();

  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const label = interval === 'month' ? 'Month' : 'Year';

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
      <Flex sx={{ flexDirection: 'column', gap: 3 }}>
        <Heading as="h2">Payment checkout</Heading>
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'offWhite',
            borderRadius: 2,
            padding: 3,
          }}
        >
          <PaymentElement options={{ layout: 'tabs' }} />
        </Box>
        {errorMessage && <Text sx={{ color: 'red' }}>{errorMessage}</Text>}
        <Button type="submit" variant="primary" disabled={!stripe || isSubmitting}>
          {isSubmitting ? 'Processing...' : `Pay ${formatPrice(selectedAmount, currency)}/${label}`}
        </Button>
        <Text variant="quiet" sx={{ fontSize: 0 }}>
          By confirming your payment, you allow us to charge your payment method for this and future
          payments in accordance with our terms. You can always cancel your subscription.
        </Text>
      </Flex>
    </form>
  );
};

export const CheckoutView = () => {
  const { stripeInstance, clientSecret, selectedAmount, interval, currency, onBack } =
    useSupporterContext();

  if (!stripeInstance || !clientSecret) return null;

  return (
    <Flex
      sx={{
        flexDirection: 'column',
        maxWidth: 800,
        mx: 'auto',
        my: [3, 5],
        px: [3, 0],
        gap: 3,
      }}
    >
      <Box
        as="button"
        onClick={onBack}
        sx={{
          alignSelf: 'flex-start',
          bg: 'white',
          border: '2px solid',
          borderColor: 'black',
          borderRadius: 2,
          px: 3,
          py: 1,
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: 1,
          fontFamily: 'body',
        }}
      >
        ← Back
      </Box>

      <Flex sx={{ gap: 3, flexDirection: ['column', 'row'], alignItems: 'flex-start' }}>
        <Card
          sx={{
            padding: 4,
            flex: 1,
            border: '2px solid',
            borderColor: 'black',
            borderRadius: 3,
          }}
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
        </Card>

        <Card
          sx={{
            padding: 4,
            border: '2px solid',
            borderColor: 'black',
            borderRadius: 3,
            minWidth: 200,
            textAlign: 'center',
          }}
        >
          <Flex sx={{ flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Heading as="h3" sx={{ fontSize: 3 }}>
              Summary
            </Heading>
            <Icon glyph="supporter" size={50} />
            <Text sx={{ fontWeight: 'bold', fontSize: 1 }}>Support</Text>
            <Text sx={{ fontWeight: 'bold', fontSize: 3 }}>
              {formatPrice(selectedAmount, currency)} /{interval === 'month' ? 'month' : 'year'}
            </Text>
            <Text variant="quiet" sx={{ fontSize: 0 }}>
              You can cancel, pause or update your subscription at any time
            </Text>
          </Flex>
        </Card>
      </Flex>
    </Flex>
  );
};
