import { observer } from 'mobx-react';
import { Button, ExternalLink, Icon, InternalLink } from 'oa-components';
import { DISCORD_INVITE_URL } from 'src/constants';
import { fields, headings } from 'src/pages/UserSettings/labels';
import { Flex, Heading, Text } from 'theme-ui';

import { PatreonIntegration } from './content/fields/PatreonIntegration';
import { ChangeEmailForm } from './content/sections/ChangeEmail.form';
import { ChangePasswordForm } from './content/sections/ChangePassword.form';

export const SettingsPageAccount = observer(() => {
  const { description, title } = fields.deleteAccount;

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
              Become a supporter
            </Heading>
            <Text variant="quiet">
              As a supporter you get a badge on the platform, special insights and voting rights on
              decisions.
            </Text>
          </Flex>
        </Flex>
        <InternalLink to="/supporter">
          <Button type="button" variant="primary">
            Support us
          </Button>
        </InternalLink>
      </Flex>

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
