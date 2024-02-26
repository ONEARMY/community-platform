import 'firebase/compat/auth'
import 'firebase/compat/storage'
import 'firebase/compat/functions'
import 'firebase/compat/database'

import { initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import firebase from 'firebase/compat/app'

import { FIREBASE_CONFIG, SITE } from '../config/config'
import { logger } from '../logger'
// initialise with config settings, additional firestore config to support future changes

firebase.initializeApp(FIREBASE_CONFIG)
const firebaseApp = initializeApp(FIREBASE_CONFIG)

// export firebase endpoints to be accessed by other functions
const rtdb = firebase.database()
const storage = firebase.storage()
const auth = getAuth(firebaseApp)
const functions = firebase.functions()

// use emulators when running on localhost:4000
if (SITE === 'emulated_site') {
  logger.debug(`Connecting rtdb on port `, 4006)
  rtdb.useEmulator('localhost', 4006)
  logger.debug(`Connecting storage on port `, 4007)
  storage.useEmulator('localhost', 4007)
  logger.debug(`Connecting auth on port `, 4005)
  connectAuthEmulator(auth, 'http://localhost:4005')
  logger.debug(`Connecting functions on port `, 4002)
  functions.useEmulator('localhost', 4002)
}

export { rtdb, storage, auth, functions }

export const EmailAuthProvider = firebase.auth.EmailAuthProvider

// want to also expose the default firebase user
export type IFirebaseUser = firebase.User
