import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'
import 'cypress-file-upload';
import { Firestore } from './firestore'


const fbConfig = {
  apiKey: 'AIzaSyDAxS_7M780mI3_tlwnAvpbaqRsQPlmp64',
  authDomain: 'onearmy-test-ci.firebaseapp.com',
  databaseURL: 'https://onearmy-test-ci.firebaseio.com',
  projectId: 'onearmy-test-ci',
  storageBucket: 'onearmy-test-ci.appspot.com'
}
firebase.initializeApp(fbConfig)
/**
 * Clear all caches before any test is executed
 */
firebase.firestore().clearPersistence().then(() => console.log('Firestore cache cleared ...'))
const deleteAppCacheReq = window.indexedDB.deleteDatabase('OneArmyCache')
deleteAppCacheReq.onsuccess = () => console.log('App cache cleared ...')


declare global {
  namespace Cypress {
    // tslint:disable-next-line:interface-name
    interface Chainable {

      login(username: string, password: string,): Promise<firebase.auth.UserCredential>

      logout(): Promise<void>

      deleteDocuments(collectionName: string, fieldPath: string, opStr: any, value: string) : Promise<void>
    }
  }
}

const attachCustomCommands = (Cypress, fb: typeof firebase) => {
  let currentUser: null | firebase.User = null
  const firestore = new Firestore(fb.firestore())

  fb.auth().onAuthStateChanged(user => {
    currentUser = user
  })

  Cypress.Commands.add('login', (email, password) => {
    Cypress.log({
      displayName: 'login',
      consoleProps: () => {
        return { email, password }
      },
    })
    return fb.auth().signInWithEmailAndPassword(email, password)
  })

  Cypress.Commands.add('logout', () => {
    const userInfo = currentUser ? currentUser.email : 'Not login yet - Skipped'
    Cypress.log({
      displayName: 'logout',
      consoleProps: () => {
        return { currentUser: userInfo }
      },
    })
    return fb.auth().signOut()
  })

  Cypress.Commands.add('deleteDocuments', (collectionName: string, fieldPath: string, opStr: any, value: string) => {
    Cypress.log({
      displayName: 'deleteDocuments',
      consoleProps: () => {
        return { collectionName, fieldPath, opStr, value }
      },
    })
    return firestore.deleteDocuments(collectionName, fieldPath, opStr, value)
  })

}

attachCustomCommands(Cypress, firebase)
