import dateformat from 'dateformat'

import { bucket } from './storage'
import { firebaseAdmin } from './admin'
import { DB_ENDPOINTS, DB_ENDPOINT_SUBCOLLECTIONS } from '../models'
import { logger } from 'firebase-functions/v1'

/*  Cloud function to automatically backup the firebase database adapted from: 
    https://firebase.google.com/docs/firestore/solutions/schedule-export

    Export API available at:
    https://cloud.google.com/firestore/docs/reference/rest/v1/projects.databases/exportDocuments
*/
export const BackupDatabase = async () => {
  //  Access underlying client via firebase-admin (not google-cloud sdk in example)
  //  https://stackoverflow.com/questions/57512324/cloud-function-to-export-firestore-backup-data-using-firebase-admin-or-google

  const client = new firebaseAdmin.firestore.v1.FirestoreAdminClient({})
  const timestamp = dateformat(Date.now(), 'yyyy-mm-dd')

  // Export only the collections and subcollections currently used by the platform
  const activeCollections = Object.values(DB_ENDPOINTS)
  // Generate a list of all unique possible subcollections. These also need to be passed
  // to the list of export collectionIds
  const uniqueSubcollections = [
    ...new Set(
      ([] as string[]).concat(...Object.values(DB_ENDPOINT_SUBCOLLECTIONS)),
    ),
  ]
  // Export all collections specified except for user revision history (can be very large, needs rethinking)
  const collectionIds = [...activeCollections, ...uniqueSubcollections].filter(
    (id) => id !== 'revisions',
  )

  const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT
  const databaseName = client.databasePath(projectId, '(default)')
  // save the export in the default storage bucket, in a backups folder
  const outputUriPrefix = `gs://${bucket.name}/backups/${timestamp}`

  logger.log('prepare backup', {
    name: databaseName,
    outputUriPrefix,
    collectionIds,
  })
  return client
    .exportDocuments({
      name: databaseName,
      outputUriPrefix,
      collectionIds,
    })
    .then((responses) => {
      const response = responses[0]
      logger.log(`Operation Name: ${response['name']}`, responses)
      return response
    })
    .catch((err) => {
      logger.error(err)
      throw new Error('Export operation failed')
    })
}
