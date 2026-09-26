import type { Moderation, TenantSettings } from 'oa-shared';
import { createElement } from 'react';
import { render } from 'react-email';
import { describe, expect, it } from 'vitest';

import { OrganisationApplicationEmail } from './organisation-application-email';

const settings = {
  siteName: 'Precious Plastic',
  siteUrl: 'https://community.example.org',
  siteImage: 'https://community.example.org/logo.png',
  messageSignOff: 'One Army',
  emailFrom: 'platform@example.org',
} as unknown as TenantSettings;

const html = (moderation: Moderation, feedback: string | null = null) =>
  render(
    createElement(OrganisationApplicationEmail, {
      contactEmail: 'platform@example.org',
      feedback,
      moderation,
      profileUrl: 'https://community.example.org/u/the_shop',
      settings,
      settingsUrl: 'https://community.example.org/settings/profile',
      username: 'the_shop',
    }),
  );

describe('organisation application email', () => {
  it('confirms a freshly submitted application', async () => {
    const out = await html('awaiting-moderation');

    expect(out).toContain('Thanks the_shop!');
    expect(out).toContain('our team is reviewing it');
    expect(out).toContain('See your profile');
  });

  it('welcomes an approved organisation and links to its public profile', async () => {
    const out = await html('accepted');

    expect(out).toContain("You&#x27;re in, the_shop!");
    expect(out).toContain('/u/the_shop');
    expect(out).toContain('See your profile');
  });

  it('spells out what to update when changes are requested', async () => {
    const out = await html('improvements-needed', 'Add a photo of the machines.');

    expect(out).toContain('Almost there, the_shop');
    expect(out).toContain('What to update: Add a photo of the machines.');
    expect(out).toContain('Update your profile');
    expect(out).toContain('/settings/profile');
  });

  it('gives a rejected applicant a reason and a way to reply', async () => {
    const out = await html('rejected', 'We could not verify the workspace.');

    expect(out).toContain('About your organisation application');
    expect(out).toContain('Reason: We could not verify the workspace.');
    expect(out).toContain('Contact the team');
    expect(out).toContain('mailto:platform@example.org');
  });

  it('omits the detail line when there is no feedback', async () => {
    const out = await html('improvements-needed', null);

    expect(out).not.toContain('What to update:');
  });
});
