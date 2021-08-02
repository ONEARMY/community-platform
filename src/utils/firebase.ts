import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/functions'
import 'firebase/database'
import { FIREBASE_CONFIG, SITE } from 'src/config/config'
// initialise with config settings, additional firestore config to support future changes

firebase.initializeApp(FIREBASE_CONFIG)

// export firebase endpoints to be accessed by other functions
const firestore = firebase.firestore()
const rtdb = firebase.database()
const storage = firebase.storage()
const auth = firebase.auth()
const functions = firebase.functions()

// use emulators when running on localhost:4000
if (SITE === 'emulated_site') {
  firestore.useEmulator('localhost', 4003)
  rtdb.useEmulator('localhost', 4006)
  storage.useEmulator('localhost', 4007)
  auth.useEmulator(`http://localhost:4005`)
  functions.useEmulator('localhost', 4002)
}

export { firestore, rtdb, storage, auth, functions }

export const EmailAuthProvider = firebase.auth.EmailAuthProvider

// want to also expose the default firebase user
export type IFirebaseUser = firebase.User
