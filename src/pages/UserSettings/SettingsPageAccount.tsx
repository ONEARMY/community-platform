import { observer } from 'mobx-react';
import { Button, ExternalLink, Icon, InternalLink } from 'oa-components';
import { UserRole } from 'oa-shared';
import { useEffect, useState } from 'react';
import { DISCORD_INVITE_URL } from 'src/constants';
import { fields, headings } from 'src/pages/UserSettings/labels';
import { stripeService } from 'src/services/stripeService';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { Flex, Heading, Text } from 'theme-ui';

import { PatreonIntegration } from './content/fields/PatreonIntegration';
import { ChangeEmailForm } from './content/sections/ChangeEmail.form';
import { ChangePasswordForm } from './content/sections/ChangePassword.form';

export const SettingsPageAccount = observer(() => {
  const { description, title } = fields.deleteAccount;
  const { isUserAuthorized } = useProfileStore();
  const isAdmin = isUserAuthorized(UserRole.ADMIN);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // TODO: Remove isAdmin guard once supporter flow is available to all users
  useEffect(() => {
    if (!isAdmin) return;
    stripeService.getSubscriptionStatus().then((status) => {
      if (status?.hasSubscription) {
        setHasSubscription(true);
      }
    });
  }, [isAdmin]);

  const handleManageSubscription = async () => {
    setIsRedirecting(true);
    const url = await stripeService.createPortalSession();
    if (url) {
      window.location.href = url;
    } else {
      setIsRedirecting(false);
    }
  };

  return (
    <Flex
      sx={{
        justifyContent: 'space-between',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <Flex sx={{ flexDirection: 'column', gap: 1 }}>
        <Heading as="h2">{headings.accountSettings}</Heading>
        <Text variant="quiet">Here you can manage the core settings of your account.</Text>
      </Flex>

      <PatreonIntegration />

      {isAdmin && (
        <Flex
          sx={{
            alignItems: 'flex-start',
            backgroundColor: 'offWhite',
            borderRadius: 3,
            flexDirection: 'column',
            padding: 4,
            gap: [2, 4],
          }}
        >
          <Flex sx={{ flexDirection: 'row', gap: [2, 4] }}>
            <Icon glyph="supporter" size={45} />
            <Flex sx={{ flexDirection: 'column', flex: 1, gap: 2 }}>
              <Heading as="h2" variant="small">
                {hasSubscription ? 'Manage your subscription' : 'Become a supporter'}
              </Heading>
              <Text variant="quiet">
                {hasSubscription
                  ? 'Update your payment method, view invoices, or cancel your subscription.'
                  : 'As a supporter you get a badge on the platform, special insights and voting rights on decisions.'}
              </Text>
            </Flex>
          </Flex>
          {hasSubscription ? (
            <Button
              type="button"
              variant="primary"
              disabled={isRedirecting}
              onClick={handleManageSubscription}
            >
              {isRedirecting ? 'Redirecting...' : 'Manage subscription'}
            </Button>
          ) : (
            <InternalLink to="/supporter">
              <Button type="button" variant="primary">
                Support us
              </Button>
            </InternalLink>
          )}
        </Flex>
      )}

      <ChangePasswordForm />
      <ChangeEmailForm />

      <Text variant="body">
        {title}{' '}
        <ExternalLink sx={{ ml: 1, textDecoration: 'underline' }} href={DISCORD_INVITE_URL}>
          {description}
        </ExternalLink>
      </Text>
    </Flex>
  );
});
