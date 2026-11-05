import type { Moderation, TenantSettings } from 'oa-shared';
import { createElement } from 'react';
import { render } from 'react-email';
import { describe, expect, it } from 'vitest';

import { MapPinModerationEmail } from './map-pin-moderation-email';

const settings = {
  siteName: 'Precious Plastic',
  siteUrl: 'https://community.example.org',
  siteImage: 'https://community.example.org/logo.png',
  messageSignOff: 'One Army',
  emailFrom: 'platform@example.org',
} as unknown as TenantSettings;

const html = (moderation: Exclude<Moderation, 'awaiting-moderation'>, feedback: string | null = null) =>
  render(
    createElement(MapPinModerationEmail, {
      feedback,
      mapUrl: 'https://community.example.org/map#the_shop',
      moderation,
      settings,
      settingsUrl: 'https://community.example.org/settings/map',
    }),
  );

describe('map pin moderation email', () => {
  it('links an approved pin to the map without feedback', async () => {
    const out = await html('accepted', 'Old note');

    expect(out).toContain('Precious Plastic has approved your map pin');
    expect(out).toContain('https://community.example.org/map#the_shop');
    expect(out).toContain('See it live');
    expect(out).not.toContain('Old note');
  });

  it('includes the feedback when changes are requested', async () => {
    const out = await html('improvements-needed', 'Add a photo of your workspace');

    expect(out).toContain('has requested changes on your map pin');
    expect(out).toContain('Add a photo of your workspace');
    expect(out).toContain('https://community.example.org/settings/map');
    expect(out).toContain('Update it now');
  });

  it('includes the feedback when the pin is rejected', async () => {
    const out = await html('rejected', 'Not a workspace');

    expect(out).toContain('has rejected your map pin');
    expect(out).toContain('Not a workspace');
  });
});
