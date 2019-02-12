import { TokenCache } from 'google-oauth-jwt'
import * as config from '../config/config.json'

export const getAccessToken = async (accessScopes: string[], callback) => {
  const tokens = new TokenCache()
  await tokens.get({
    email: config.client_email,
    key: config.private_key,
    scopes: accessScopes
  }, (err, token) => {
    return callback(token)
  })
}