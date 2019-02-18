import { JWT } from 'google-auth-library'
import Axios from 'axios'
import { config } from 'firebase-functions'

/*  Cloud function to automatically backup the firebase database adapted from: 
    https://thatweirddeveloper.com/how-to-back-up-cloud-firestore-periodically
*/

// config has access to environment variables set in root scripts/deploy.sh
const PROJECT_ID = config().project_id
console.log('project id', PROJECT_ID)
// authorise application using JWT
const getAccessToken = async () => {
  const scopes = [
    'https://www.googleapis.com/auth/datastore',
    'https://www.googleapis.com/auth/cloud-platform',
  ]
  const jwtClient = new JWT(
    config().client_email,
    null,
    config().private_key,
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
