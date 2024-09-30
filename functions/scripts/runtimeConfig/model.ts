import { configVars } from 'oa-shared/models/config'

/** Variables populates in the same way firebase functions:config:set does for use in testing */
export const runtimeConfigTest: configVars = {
  analytics: {
    tracking_code: 'fake_tracking_code',
    view_id: 'fake_view_id',
  },
  integrations: {
    discord_webhook: 'https://fake_discord_webhook.local',
    discord_alert_channel_webhook:
      'https://fake_discord_alert_channel_webhook.local',
    slack_webhook: 'https://fake_slack_webhook.local',
    patreon_client_id: 'fake_patreon_client_id',
    patreon_client_secret: 'fake_patreon_client_secret',
  },
  service: null as any,
  deployment: {
    site_url: 'http://localhost:4000',
  },
  prerender: {
    api_key: 'fake_prerender_key',
  },
}
