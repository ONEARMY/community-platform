import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { format } from 'date-fns';
import { Button, Icon, Modal } from 'oa-components';
import { useEffect, useState } from 'react';
import { type SubscriptionStatus, stripeService } from 'src/services/stripeService';
import { Flex, Heading, Text } from 'theme-ui';

export const HEADING = 'Stripe Subscription (Embedded)';
export const DESCRIPTION =
  'Support us with a subscription and get a supporter badge on the platform.';
export const SUBSCRIBED_MESSAGE = 'Thanks for being a supporter!';
export const CANCELING_MESSAGE = 'Your subscription will end on';

export const SUBSCRIBE_BUTTON_TEXT = 'Subscribe';
export const MANAGE_BUTTON_TEXT = 'Manage Subscription';

export const StripeIntegrationEmbedded = () => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [stripeInstance, setStripeInstance] = useState<Promise<Stripe | null> | null>(null);

  const fetchSubscriptionStatus = async () => {
    const status = await stripeService.getSubscriptionStatus();
    if (status) {
      setSubscriptionStatus(status);
    }
  };

  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  const handleSubscribe = async () => {
    setIsLoading(true);
    const result = await stripeService.createEmbeddedCheckoutSession();
    if (result) {
      setStripeInstance(loadStripe(result.publishableKey));
      setClientSecret(result.clientSecret);
      setIsModalOpen(true);
    }
    setIsLoading(false);
  };

  const handleManageSubscription = async () => {
    setIsLoading(true);
    const portalUrl = await stripeService.createPortalSession();
    if (portalUrl) {
      window.location.assign(portalUrl);
    }
    setIsLoading(false);
  };

  const handleModalDismiss = () => {
    setIsModalOpen(false);
    setClientSecret(null);
    setStripeInstance(null);
    fetchSubscriptionStatus();
  };

  const hasActiveSubscription = subscriptionStatus?.hasSubscription;
  const isCanceling =
    subscriptionStatus?.subscription?.cancelAtPeriodEnd ||
    !!subscriptionStatus?.subscription?.cancelAt;
  const cancelDate = subscriptionStatus?.subscription?.cancelAt
    ? format(new Date(subscriptionStatus.subscription.cancelAt * 1000), 'dd-MM-yyyy')
    : null;

  return (
    <>
      <Flex
        sx={{
          alignItems: ['flex-start', 'flex-start', 'flex-start'],
          backgroundColor: 'offWhite',
          borderRadius: 3,
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 4,
          gap: [2, 4],
        }}
      >
        <Flex sx={{ flexDirection: 'row', gap: [2, 4] }}>
          <Icon glyph="star-active" size={45} />
          <Flex sx={{ flexDirection: 'column', flex: 1, gap: [2] }}>
            <Heading as="h2" variant="small">
              {HEADING}
            </Heading>
            {hasActiveSubscription ? (
              <Flex sx={{ flexDirection: 'column', gap: 2 }}>
                <Text>{SUBSCRIBED_MESSAGE}</Text>
                {isCanceling && (
                  <Text variant="quiet" sx={{ fontStyle: 'italic' }}>
                    {CANCELING_MESSAGE} {cancelDate}.
                  </Text>
                )}
              </Flex>
            ) : (
              <Text variant="quiet">{DESCRIPTION}</Text>
            )}
          </Flex>
        </Flex>

        <Flex sx={{ gap: 2 }}>
          {hasActiveSubscription ? (
            <Button
              type="button"
              onClick={handleManageSubscription}
              variant="primary"
              disabled={isLoading}
            >
              {MANAGE_BUTTON_TEXT}
            </Button>
          ) : (
            <Button type="button" onClick={handleSubscribe} variant="primary" disabled={isLoading}>
              {SUBSCRIBE_BUTTON_TEXT}
            </Button>
          )}
        </Flex>
      </Flex>

      {stripeInstance && clientSecret && (
        <Modal isOpen={isModalOpen} onDismiss={handleModalDismiss} width={600}>
          <EmbeddedCheckoutProvider stripe={stripeInstance} options={{ clientSecret }}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </Modal>
      )}
    </>
  );
};
