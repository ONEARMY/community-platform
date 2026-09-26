import type { Moderation, TenantSettings } from 'oa-shared';
import React from 'react';
import { Section, Text } from 'react-email';

import { Button } from './components/button';
import { Heading } from './components/heading';
import { Layout } from './Layout';

const text = {
  fontSize: '16px',
  lineHeight: 1.6,
  margin: '0 0 16px',
};

type OrganisationApplicationEmailArgs = {
  contactEmail: string;
  feedback: string | null;
  moderation: Moderation;
  profileUrl: string;
  settings: TenantSettings;
  settingsUrl: string;
  username: string;
};

export const OrganisationApplicationEmail = ({
  contactEmail,
  feedback,
  moderation,
  profileUrl,
  settings,
  settingsUrl,
  username,
}: OrganisationApplicationEmailArgs) => {
  const copy = {
    'awaiting-moderation': {
      preview: `Thanks ${username}! Your application is in`,
      heading: `Thanks ${username}!\nYour application is in`,
      lines: [
        "We've received your organisation profile and our team is reviewing it. We'll email you as soon as there's an update — no action needed for now.",
      ],
      detail: null,
      closing:
        'Reviews are done by humans, so this can take a little while.\nThanks for your patience.',
      action: { href: settingsUrl, label: 'See your profile' },
    },
    accepted: {
      preview: `You're in, ${username}!`,
      heading: `You're in, ${username}!`,
      lines: [
        'Your organisation profile has been approved and is now visible to the community. Welcome aboard.',
      ],
      detail: null,
      closing: 'You can edit your details any time from your settings.',
      action: { href: profileUrl, label: 'See your profile' },
    },
    'improvements-needed': {
      preview: `Almost there, ${username}`,
      heading: `Almost there, ${username}`,
      lines: [
        'Your organisation profile is nearly ready — we just need a few changes before it can go live.',
      ],
      detail: feedback ? `What to update: ${feedback}` : null,
      closing: 'Once you’ve made the changes, your profile goes back into review automatically.',
      action: { href: settingsUrl, label: 'Update your profile' },
    },
    rejected: {
      preview: 'About your organisation application',
      heading: 'About your organisation application',
      lines: [
        "Thanks for taking the time to apply. After review, we're not able to approve your organisation profile at this time.",
      ],
      detail: feedback ? `Reason: ${feedback}` : null,
      closing:
        "If you think this was a mistake or you'd like to reapply with changes, just reply to this email or get in touch.",
      action: { href: `mailto:${contactEmail}`, label: 'Contact the team' },
    },
  }[moderation];

  return (
    <Layout emailType="moderation" preview={copy.preview} settings={settings}>
      <Section style={{ padding: '20px' }}>
        <Heading customStyle={{ whiteSpace: 'pre-line' }}>{copy.heading}</Heading>

        {copy.lines.map((line) => (
          <Text key={line} style={text}>
            {line}
          </Text>
        ))}

        {copy.detail && <Text style={{ ...text, whiteSpace: 'pre-wrap' }}>{copy.detail}</Text>}

        <Text style={{ ...text, whiteSpace: 'pre-line' }}>{copy.closing}</Text>

        <Button
          customStyle={{ backgroundColor: '#fee77b', fontSize: '16px', padding: '14px 26px' }}
          href={copy.action.href}
        >
          {copy.action.label} →
        </Button>
      </Section>
    </Layout>
  );
};
