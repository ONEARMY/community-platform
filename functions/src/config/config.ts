import { config } from 'firebase-functions'

/* config variables are attached attached directly to firebase using the cli
   $firebase functions:config:set ...
   to have additional config passed contact admin who will add it
*/
let c = config() as configVars
// If running emulated or without firebase login provide dummy data instead
if (Object.keys(c).length === 0) {
  c = { analytics: {}, deployment: {}, integrations: {}, service: null } as any
}
// strip additional character escapes (\\n -> \n)
if (c.service?.private_key) {
  c.service.private_key = c.service.private_key.replace(/\\n/g, '\n')
}

export const CONFIG = c
export const SERVICE_ACCOUNT_CONFIG = c.service
export const ANALYTICS_CONFIG = c.analytics
/************** Interfaces ************** */
interface IServiceAccount {
  type: string
  project_id: string
  private_key_id: string
  private_key: string
  client_email: string
  client_id: string
  auth_uri: string
  token_uri: string
  auth_provider_x509_cert_url: string
  client_x509_cert_url: string
}
interface IAnalytics {
  tracking_code: string
  view_id: string
}
interface IIntergrations {
  slack_webhook: string
  discord_webhook: string
}
interface IDeployment {
  site_url: string
}

interface configVars {
  service: IServiceAccount
  analytics: IAnalytics
  integrations: IIntergrations
  deployment: IDeployment
}

// if passing complex config variables, may want to
// encode as b64 and unencode here to avoid character escape challenges
function _b64ToString(b64str: string) {
  return Buffer.from(b64str, 'base64').toString('binary')
}
