import { credential, initializeApp } from 'firebase-admin'

initializeApp({
  credential: credential.cert(
    JSON.parse(import.meta.env.GOOGLE_APPLICATION_CREDENTIALS),
  ),
  databaseURL: `https://${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseio.com`,
})
