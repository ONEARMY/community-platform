import Axios from 'axios'
import { getAccessToken } from './utils'
import { config } from 'firebase-functions'

/*  Cloud function to automatically backup the firebase database adapted from: 
    https://thatweirddeveloper.com/how-to-back-up-cloud-firestore-periodically

    Note this requires use of a service account to access drive storage,
    which is accessed from environment variables
*/

// rest reference: https://cloud.google.com/firestore/docs/reference/rest/v1beta2/projects.databases/exportDocuments
export const BackupDatabase = async () => {
  console.log('executing database backup')
  const scopes = [
    'https://www.googleapis.com/auth/datastore',
    'https://www.googleapis.com/auth/cloud-platform',
  ]
  const accessToken = await getAccessToken(scopes)
  console.log('access token received', accessToken)
  const PROJECT_ID = config().project_id
  console.log('project id', PROJECT_ID)
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
