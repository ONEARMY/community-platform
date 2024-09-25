import { config } from 'firebase-functions'
import { configVars } from 'oa-shared/models/config'

/* config variables are attached directly to firebase using the cli
   $firebase functions:config:set ...
   to have additional config passed contact an admin who will add it
*/
let c = config() as configVars
// If running emulated or without firebase login provide dummy data instead
if (Object.keys(c).length === 0) {
  console.log('config is empty')
  if (process.env.GCLOUD_PROJECT === 'demo-community-platform-emulated') {
    console.log('using emulator config')
    c = {
      analytics: {},
      deployment: {
        site_url: 'http://localhost:4000',
      },
      integrations: {
        discord_webhook: 'http://simulated-webhook-receiver:30102/discord',
        slack_webhook: 'http://simulated-webhook-receiver:30102/slack',
      },
      service: null,
    } as any
  } else {
    c = {
      analytics: {},
      deployment: {},
      integrations: {},
      service: null,
    } as any
  }
}
// strip additional character escapes (\\n -> \n)
if (c.service?.private_key) {
  c.service.private_key = c.service.private_key.replace(/\\n/g, '\n')
}

export const CONFIG = c
export const SERVICE_ACCOUNT_CONFIG = c.service
export const ANALYTICS_CONFIG = c.analytics
