import type { configVars } from '../../src/config/config'

/** Variables populates in the same way firebase functions:config:set does for use in testing */
export const runtimeConfigTest: configVars = {
  analytics: {
    tracking_code: 'fake_tracking_code',
    view_id: 'fake_view_id',
  },
  integrations: {
    discord_webhook:
      'https://discord.com/api/webhooks/1249350284187275274/zmFazwD4y2vun042qcDx4a_UhejAU-EPxkWVtJZwpiGj_f9JmUO-u_kJW2mCmmO1HGar',
    discord_alert_channel_webhook:
      'https://fake_discord_alert_channel_webhook.local',
    discord_channel_id: '1249349026625880115',
    discord_bot_token:
      'MTI0OTM0Njk4Njg2ODYwNDkzOQ.GvzoC2.izr8ElcHTrWYNZVG_RhAEsvJXfGCVfwx6cQ_VE',
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
