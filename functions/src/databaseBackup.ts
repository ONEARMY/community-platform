import { pubsub } from 'firebase-functions'
import { JWT } from 'google-auth-library'
import * as admin from 'firebase-admin'
// import * as rp from 'request-promise'
import * as devKey from './config/dev-service-account-key.json'

const PROJECT_ID = 'test'

admin.initializeApp()

// authorise application using JWT, requires key file defined above as dev key
// see config/readme for more info
const getAccessToken = async () => {
  const scopes = [
    'https://www.googleapis.com/auth/datastore',
    'https://www.googleapis.com/auth/cloud-platform',
  ]
  const jwtClient = new JWT(
    devKey.client_email,
    null,
    devKey.private_key,
    scopes,
  )
  try {
    const authorization = await jwtClient.authorize()
    console.log('authorisation successful', authorization)
    return authorization.access_token
  } catch (error) {
    console.error(error)
    return null
  }
}

export const AuthTest = async () => {
  const token = await getAccessToken()
  return token
}

export const DatabaseBackup = async () =>
  pubsub.topic('firebase-backup').onPublish(async (message, context) => {
    console.log('executing database backup')
    const accessToken = await getAccessToken()
    console.log('access token received', accessToken)
    const url = `https://firestore.googleapis.com/v1beta1/projects/${PROJECT_ID}/databases/(default):exportDocuments`
    // return rp.post(url, {
    //   headers: {
    //     Authorization: `Bearer ${accessToken}`,
    //   },
    //   json: true,
    //   body: {
    //     outputUriPrefix: `gs://${PROJECT_ID}-backups`,
    //   },
    // })
  })
