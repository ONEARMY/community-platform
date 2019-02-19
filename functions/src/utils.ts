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
  console.log('getting access token', accessScopes)
  console.log('config', config().service)
  const b64Key = config().service.private_key
  const privateKey = Buffer.from(b64Key, 'base64').toString('binary')
  // private key set to firebase config from CI is encoded as base64 as
  // contains large number of special characters
  console.log('private key', privateKey)
  const jwtClient = new JWT(
    config().service.client_email,
    null,
    privateKey,
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
