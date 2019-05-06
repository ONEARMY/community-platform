import { JWT } from 'google-auth-library'
import { SERVICE_ACCOUNT_CONFIG } from '../config/config'

// config has access to environment variables set in root scripts/deploy.sh
// authorise application using JWT
const service = SERVICE_ACCOUNT_CONFIG
export const getAccessToken = async (
  accessScopes: string[],
  callback?: (token: string) => void,
) => {
  const jwtClient = new JWT(
    service.client_email,
    null,
    service.private_key,
    accessScopes,
  )
  const credentials = await jwtClient.authorize()
  return credentials
}

export const AuthTest = async () => {
  // // test to get readonly access to analytics data
  const token = await getAccessToken([
    'https://www.googleapis.com/auth/analytics.readonly',
  ])
  return token
}
