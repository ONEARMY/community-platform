import Axios from 'axios'
import { getAccessToken } from '../Utils/auth.utils'
import { SERVICE_ACCOUNT_CONFIG } from '../config/config'
import * as google from 'google-auth-library'
import * as dateformat from 'dateformat'

/*  Cloud function to automatically backup the firebase database adapted from: 
    https://thatweirddeveloper.com/how-to-back-up-cloud-firestore-periodically

    More examples at:
    https://firebase.google.com/docs/firestore/solutions/schedule-export

    Note this requires use of a service account to access drive storage,
    which is accessed from environment variables
*/

// rest reference: https://cloud.google.com/firestore/docs/reference/rest/v1beta2/projects.databases/exportDocuments
export const BackupDatabase = async () => {
  console.log('executing database backup')
  // TODO - no longer using util auth, should revise code to see if still relevant or not
  const auth = await google.auth.getClient({
    scopes: ['https://www.googleapis.com/auth/datastore'],
  })
  const accessTokenResponse = await auth.getAccessToken()
  const accessToken = accessTokenResponse.token
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + accessToken,
  }

  console.log('access token received', accessToken)
  const PROJECT_ID = SERVICE_ACCOUNT_CONFIG.project_id

  const url = `https://firestore.googleapis.com/v1beta1/projects/${PROJECT_ID}/databases/(default):exportDocuments`
  // use axios to send post request as promise
  console.log('posting', url)
  const timestamp = dateformat(Date.now(), 'yyyy-mm-dd-HH-MM-ss')
  const body = {
    outputUriPrefix: `gs://${PROJECT_ID}.appspot.com/backups/${timestamp}`,
  }
  try {
    const response = await Axios.post(url, body, { headers: headers })
    return { status: 200, message: response.data }
  } catch (error) {
    return { status: 500, message: error.response.data }
  }
}

// const createSub = async () => {
//   pubsub
//     .topic('firebase-backup')
//     .onPublish(async (message, context) => BackupDatabase)
// }
