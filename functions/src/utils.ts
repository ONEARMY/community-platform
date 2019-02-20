import { JWT } from 'google-auth-library'
import { config } from 'firebase-functions'

// config has access to environment variables set in root scripts/deploy.sh
// authorise application using JWT

export const AuthTest = async () => {
  // test to get readonly access to analytics data
  const token = await getAccessToken([
    'https://www.googleapis.com/auth/analytics.readonly',
  ])
  return token
}

export const getAccessToken = async (
  accessScopes: string[],
  // callback?: (token: string) => void,
) => {
  // service account details json encoded as base64 string
  const service_b64 = config().service.json
  const service = JSON.parse(
    Buffer.from(service_b64, 'base64').toString('binary'),
  )
  // private key set to firebase config from CI is encoded as base64 as
  // contains large number of special characters
  const jwtClient = new JWT(
    config().service.client_email,
    null,
    service.private_key,
    accessScopes,
  )
  const credentials = await jwtClient.authorize()
  return credentials
}
