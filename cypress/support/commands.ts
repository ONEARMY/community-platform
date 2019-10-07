import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'

const fbConfig = {
  apiKey: 'AIzaSyDAxS_7M780mI3_tlwnAvpbaqRsQPlmp64',
  authDomain: 'onearmy-test-ci.firebaseapp.com',
  databaseURL: 'https://onearmy-test-ci.firebaseio.com',
  projectId: 'onearmy-test',
  storageBucket: 'onearmy-test-ci.appspot.com'
}
firebase.initializeApp(fbConfig)

declare global {
  namespace Cypress {
    // tslint:disable-next-line:interface-name
    interface Chainable {
      firestore(): Promise<firebase.firestore.Firestore>

      login(
        username: string,
        password: string,
      ): Promise<firebase.auth.UserCredential>

      logout(): Promise<void>
    }
  }
}

const attachCustomCommands = (
  Cypress,
  { auth, firestore }: typeof firebase,
) => {
  let currentUser: null | firebase.User = null
  auth().onAuthStateChanged(user => {
    currentUser = user
  })

  Cypress.Commands.add('login', (email, password) => {
    Cypress.log({
      displayName: 'login',
      consoleProps: () => {
        return { email, password }
      },
    })
    return auth().signInWithEmailAndPassword(email, password)
  })

  Cypress.Commands.add('logout', () => {
    const userInfo = currentUser ? currentUser.email : 'Not login yet - Skipped'
    Cypress.log({
      displayName: 'logout',
      consoleProps: () => {
        return { currentUser: userInfo }
      },
    })
    return auth().signOut()
  })

  Cypress.Commands.add('firestore', () => {
    return firestore()
  })
}

attachCustomCommands(Cypress, firebase)
