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
  console.log('config', config())
  const jwtClient = new JWT(
    config().service.client_email,
    null,
    config().service.private_key,
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
