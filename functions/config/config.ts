import { config } from 'firebase-functions'

// config variables are attached to the firebase config() function during build, and exposed as follows
// to have additional config passed contact admin who will add the environment variables to the CI build
const configVars = config() as configVars
const service_b64 = config().service.json as string
const serviceAccount = _b64StrToJson(service_b64) as IServiceAccount
const analytics_b64 = config().analytics.json as string
const analytics = _b64StrToJson(analytics_b64) as IAnalytics

export const SERVICE_ACCOUNT_CONFIG = serviceAccount
export const ANALYTICS_CONFIG = analytics

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
  trackingCode: string
  viewId: string
}

// most config is passed as base64 encoded strings, to allow more complex json objects to be passed as strings
// this can be done online at: https://www.browserling.com/tools/json-to-base64
interface configVars {
  service: {
    json: string
  }
  analytics: {
    json: string
  }
}

function _b64StrToJson(str: string) {
  return JSON.parse(Buffer.from(str, 'base64').toString('binary'))
}
