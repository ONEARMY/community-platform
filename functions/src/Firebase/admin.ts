/***********************************************************
When running on live the config below pulls all data from 
environment variables.
***********************************************************/
import * as admin from 'firebase-admin'
import { SERVICE_ACCOUNT_CONFIG } from '../config/config'

const serviceAccount = SERVICE_ACCOUNT_CONFIG
const FIREBASE_CONFIG = JSON.parse(
  process.env.FIREBASE_CONFIG,
) as IFirebaseConfig
// Use Service Account Config
if (serviceAccount) {
  console.log(`[Admin Configuration] - ${FIREBASE_CONFIG.projectId}`)
  const cert = {
    clientEmail: serviceAccount.client_email,
    privateKey: serviceAccount.private_key,
    projectId: serviceAccount.project_id,
  }
  admin.initializeApp({
    credential: admin.credential.cert(cert),
    databaseURL: FIREBASE_CONFIG.databaseURL,
    projectId: FIREBASE_CONFIG.projectId,
  })
}
// Use Emulator Config
else if (process.env.FUNCTIONS_EMULATOR === 'true') {
  console.log('[Admin Configuration] - emulator')
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    // supplied to env but for some reason still has to be manually specified (possible bug?)
    databaseURL: process.env.FIREBASE_DATABASE_EMULATOR_HOST,
    projectId: process.env.GCLOUD_PROJECT,
  })
}
// Use Google Default Environment (only works on google server)
else {
  console.log(`[Admin Configuration] - ${FIREBASE_CONFIG.projectId}`)
  admin.initializeApp()
}


export const firebaseAdmin = admin

// this is automatically populated by firebase
export interface IFirebaseConfig {
  databaseURL: string
  storageBucket: string
  projectId: string
}
