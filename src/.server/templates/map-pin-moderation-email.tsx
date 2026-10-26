import type { Moderation, TenantSettings } from 'oa-shared';
import { Section, Text } from 'react-email';

import { Button } from './components/button';
import { Heading } from './components/heading';
import { Layout } from './Layout';

const text = {
  fontSize: '16px',
  lineHeight: 1.6,
  margin: '0 0 16px',
};

const ACTIONS: Record<Exclude<Moderation, 'awaiting-moderation'>, string> = {
  accepted: 'has approved',
  'improvements-needed': 'has requested changes on',
  rejected: 'has rejected',
};

type MapPinModerationEmailArgs = {
  feedback: string | null;
  mapUrl: string;
  moderation: Exclude<Moderation, 'awaiting-moderation'>;
  settings: TenantSettings;
  settingsUrl: string;
};

export const MapPinModerationEmail = ({
  feedback,
  mapUrl,
  moderation,
  settings,
  settingsUrl,
}: MapPinModerationEmailArgs) => {
  const heading = `${settings.siteName} ${ACTIONS[moderation]} your map pin`;
  const isAccepted = moderation === 'accepted';

  return (
    <Layout emailType="moderation" preview={heading} settings={settings}>
      <Section style={{ padding: '20px' }}>
        <Heading>{heading}</Heading>

        {!isAccepted && feedback && (
          <>
            <Text style={{ ...text, fontWeight: 'bold' }}>They wrote:</Text>
            <Text style={{ ...text, whiteSpace: 'pre-wrap' }}>{feedback}</Text>
          </>
        )}

        <Button
          customStyle={{ backgroundColor: '#fee77b', fontSize: '16px', padding: '14px 26px' }}
          href={isAccepted ? mapUrl : settingsUrl}
        >
          {isAccepted ? 'See it live' : 'Update it now'} →
        </Button>
      </Section>
    </Layout>
  );
};
