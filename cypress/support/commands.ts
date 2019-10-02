import attachCustomCommands from 'cypress-firebase/lib/attachCustomCommands'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'

const projectId = Cypress.env('FIREBASE_PROJECT_ID')
const apiKey = Cypress.env('FIREBASE_API_KEY')
const fbConfig = {
  apiKey,
  authDomain: `${projectId}.firebaseapp.com`,
  databaseURL: `https://${projectId}.firebaseio.com`,
  projectId: `${projectId}`,
  storageBucket: `${projectId}.appspot.com`,
  messagingSenderId: '174193431763',
}
firebase.initializeApp(fbConfig)
attachCustomCommands({ Cypress, cy, firebase })
