import type { configVars } from '../../src/config/config'

/** Variables populates in the same way firebase functions:config:set does for use in testing */
export const runtimeConfigTest: configVars = {
  analytics: {
    tracking_code: 'fake_tracking_code',
    view_id: 'fake_view_id',
  },
  integrations: {
    discord_webhook: 'https://fake_discord_webhook.com',
    discord_alert_channel_webhook:
      'https://fake_discord_alert_channel_webhook.com',
    slack_webhook: 'https://fake_slack_webhook.com',
  },
  service: null as any,
  deployment: {
    site_url: 'http://localhost:4000',
  },
  prerender: {
    api_key: 'fake_prerender_key',
  },
}
