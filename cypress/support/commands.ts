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

      step(message: string)

      uploadFiles(filePath: string | string[])
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

  Cypress.Commands.add('step', (message: string) => {
    Cypress.log({
      displayName: 'step',
      message: `**${message}**`
    })
  })

  const resolveMimeType = (filePath: string) => {
    const mimeTypeMapping  = [
      ['.jpg', 'image/jpg'],
      ['.png', 'image/png'],
    ]
    const [_, mimeType]: any = mimeTypeMapping.find(([ext]) => filePath.endsWith(ext))
    if (!mimeType) {
      throw new Error(`Please define the mime type for ${filePath} here!`)
    }
    return mimeType
  }
  Cypress.Commands.add('uploadFiles', {prevSubject: 'element'}, ($inputElement, filePath: string | string[]) => {
    const filePaths: string[] = []
    if (typeof filePath === 'string') {
      filePaths.push(filePath)
    } else {
      filePaths.push(...filePath)
    }
    const getContentReqs = filePaths.map(path => {
      return new Cypress.Promise(resolve => {
        return cy.fixture(path).then(fileContent => {
          resolve({ fileName: path, mimeType: resolveMimeType(path), fileContent })
        })
      })
    })

    Cypress.Promise.all(getContentReqs).then((fileData: FileData[]) => {
      cy.wrap($inputElement).upload(fileData)
    })
  })
}

attachCustomCommands(Cypress, firebase)
