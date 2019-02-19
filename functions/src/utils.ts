import { JWT } from 'google-auth-library'
import { config } from 'firebase-functions'

// config has access to environment variables set in root scripts/deploy.sh
// authorise application using JWT

export const AuthTest = async () => {
  await getAccessToken([], token => console.log('token received successfully'))
}

export const getAccessToken = async (
  accessScopes: string[],
  callback?: (token: string) => void,
) => {
  const jwtClient = new JWT(
    config().service.client_email,
    null,
    config().service.private_key,
    accessScopes,
  )
  try {
    const authorization = await jwtClient.authorize()
    return callback
      ? callback(authorization.access_token)
      : authorization.access_token
  } catch (error) {
    return null
  }
}
