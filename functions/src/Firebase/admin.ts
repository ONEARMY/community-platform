/***********************************************************
When running on live the config below pulls all data from 
environment variables.
***********************************************************/
import admin from 'firebase-admin'
import { SERVICE_ACCOUNT_CONFIG } from '../config/config'
const serviceAccount = SERVICE_ACCOUNT_CONFIG
const FIREBASE_CONFIG = JSON.parse(
  process.env.FIREBASE_CONFIG || '{}',
) as IFirebaseConfig
let firebaseApp: admin.app.App
// Use Emulator Config
if (process.env.FUNCTIONS_EMULATOR === 'true') {
  console.log('[Admin Configuration] - emulator')
  // HACK - emulator db doesn't configure correctly with env var for some reason
  // https://github.com/firebase/firebase-tools/issues/2852
  // https://github.com/firebase/firebase-admin-node/issues/1096
  const databaseURL = process.env.FIREBASE_DATABASE_EMULATOR_HOST
  delete process.env.FIREBASE_DATABASE_EMULATOR_HOST
  firebaseApp = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL,
    projectId: process.env.GCLOUD_PROJECT,
  })
}
// Use Service Account Config
else if (serviceAccount) {
  console.log(`[Admin Configuration] - ${FIREBASE_CONFIG.projectId}`)
  const cert = {
    clientEmail: serviceAccount.client_email,
    privateKey: serviceAccount.private_key,
    projectId: serviceAccount.project_id,
  }
  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(cert),
    databaseURL: FIREBASE_CONFIG.databaseURL,
    projectId: FIREBASE_CONFIG.projectId,
  })
}

// Use Google Default Environment (only works on google server)
else {
  console.log(`[Admin Configuration] - ${FIREBASE_CONFIG.projectId}`)
  admin.initializeApp()
}

export { firebaseApp }
export const firebaseAdmin = admin

// this is automatically populated by firebase
export interface IFirebaseConfig {
  databaseURL: string
  storageBucket: string
  projectId: string
}
