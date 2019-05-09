/***********************************************************
When running on live the config below pulls all data from 
environment variables.
***********************************************************/
import * as admin from 'firebase-admin'
const FIREBASE_CONFIG = JSON.parse(
  process.env.FIREBASE_CONFIG,
) as IFirebaseConfig

import { SERVICE_ACCOUNT_CONFIG } from '../config/config'
const serviceAccount = SERVICE_ACCOUNT_CONFIG

const cert = {
  clientEmail: serviceAccount.client_email,
  privateKey: serviceAccount.private_key,
  projectId: serviceAccount.project_id,
}
console.log('initialising app', cert, FIREBASE_CONFIG.databaseURL)

admin.initializeApp({
  credential: admin.credential.cert(cert),
  databaseURL: FIREBASE_CONFIG.databaseURL,
})

export const firebaseAdmin = admin

// this is automatically populated by firebase
interface IFirebaseConfig {
  databaseURL: string
  storageBucket: string
  projectId: string
}
