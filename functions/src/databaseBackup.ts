// import { pubsub } from 'firebase-functions'
import { JWT } from 'google-auth-library'
// import * as rp from 'request-promise'
import * as config from './config/dev-service-account-key.json'
import Axios from 'axios'

/*  Cloud function to automatically backup the firebase database adapted from: 
    https://thatweirddeveloper.com/how-to-back-up-cloud-firestore-periodically
*/

const PROJECT_ID = config.project_id

// authorise application using JWT, requires key file defined above as dev key
// see config/readme for more info
const getAccessToken = async () => {
  const scopes = [
    'https://www.googleapis.com/auth/datastore',
    'https://www.googleapis.com/auth/cloud-platform',
  ]
  const jwtClient = new JWT(
    config.client_email,
    null,
    config.private_key,
    scopes,
  )
  try {
    const authorization = await jwtClient.authorize()
    return authorization.access_token
  } catch (error) {
    return null
  }
}

export const AuthTest = async () => {
  const token = await getAccessToken()
  return token
}

// rest reference: https://cloud.google.com/firestore/docs/reference/rest/v1beta2/projects.databases/exportDocuments
export const BackupDatabase = async () => {
  console.log('executing database backup')
  const accessToken = await getAccessToken()
  console.log('access token received', accessToken)
  const url = `https://firestore.googleapis.com/v1beta1/projects/${PROJECT_ID}/databases/(default):exportDocuments`
  // use axios to send post request as promise
  console.log('posting', url)
  const timestamp: string = new Date().toString()
  let res
  try {
    res = await Axios({
      url: url,
      method: 'post',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        outputUriPrefix: `gs://${PROJECT_ID}.appspot.com/backups/${timestamp}`,
      },
    })
  } catch (error) {
    res = 404
  }
  return res
}

// const createSub = async () => {
//   pubsub
//     .topic('firebase-backup')
//     .onPublish(async (message, context) => BackupDatabase)
// }
