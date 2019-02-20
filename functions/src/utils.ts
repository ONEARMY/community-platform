import { JWT } from 'google-auth-library'
import { config } from 'firebase-functions'

// config has access to environment variables set in root scripts/deploy.sh
// authorise application using JWT

export const AuthTest = async () => {
  const token = await getAccessToken([])
  return token
}

export const getAccessToken = async (
  accessScopes: string[],
  callback?: (token: string) => void,
) => {
  // service account details json encoded as base64 string
  const service_b64 = config().service.json
  console.log('service', service_b64)
  const service = JSON.parse(
    Buffer.from(service_b64, 'base64').toString('binary'),
  )
  console.log('service', service)
  // private key set to firebase config from CI is encoded as base64 as
  // contains large number of special characters
  const jwtClient = new JWT(
    config().service.client_email,
    null,
    service.private_key,
    accessScopes,
  )
  try {
    const authorization = await jwtClient.authorize()
    console.log('authorization received', authorization)
    return callback
      ? callback(authorization.access_token)
      : authorization.access_token
  } catch (error) {
    console.log('error', error)
    return null
  }
}
