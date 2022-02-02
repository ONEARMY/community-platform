import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/functions'
import 'firebase/database'
import { FIREBASE_CONFIG, SITE } from '../config/config'
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
  console.log(`Connecting to emulated services:`)
  firestore.useEmulator('localhost', 4003)
  console.log(`Connecting rtdb on port `, 4006)
  rtdb.useEmulator('localhost', 4006)
  console.log(`Connecting storage on port `, 4007)
  storage.useEmulator('localhost', 4007)
  console.log(`Connecting auth on port `, 4005)
  auth.useEmulator(`http://localhost:4005`)
  console.log(`Connecting functions on port `, 4002)
  functions.useEmulator('localhost', 4002)
}

export { firestore, rtdb, storage, auth, functions }

export const EmailAuthProvider = firebase.auth.EmailAuthProvider

// want to also expose the default firebase user
export type IFirebaseUser = firebase.User
