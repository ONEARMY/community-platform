/***********************************************************
When serving locally use service account info provided

***********************************************************/
import * as admin from 'firebase-admin'
const FIREBASE_CONFIG = JSON.parse(
  process.env.FIREBASE_CONFIG,
) as IFirebaseConfig

const serviceAccount = require('../config/serviceAccount.json')

admin.initializeApp({
  credential: admin.credential.cert({
    clientEmail: serviceAccount.client_email,
    privateKey: serviceAccount.private_key,
    projectId: serviceAccount.project_id,
  }),
  databaseURL: FIREBASE_CONFIG.databaseURL,
})
export const firebaseAdmin = admin

// this is automatically populated by firebase
interface IFirebaseConfig {
  databaseURL: string
  storageBucket: string
  projectId: string
}
