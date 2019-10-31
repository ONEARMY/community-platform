import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'
import 'cypress-file-upload'
import { Firestore } from './firestore'
import FileData = Cypress.FileData

const fbConfig = {
  apiKey: 'AIzaSyDAxS_7M780mI3_tlwnAvpbaqRsQPlmp64',
  authDomain: 'onearmy-test-ci.firebaseapp.com',
  databaseURL: 'https://onearmy-test-ci.firebaseio.com',
  projectId: 'onearmy-test-ci',
  storageBucket: 'onearmy-test-ci.appspot.com',
}

export enum UserMenuItem {
  Profile = 'Profile',
  Settings = 'Settings',
  LogOut = 'Log out',
}
firebase.initializeApp(fbConfig)
/**
 * Clear all caches before any test is executed
 */
firebase
  .firestore()
  .clearPersistence()
  .then(() => console.log('Firestore cache cleared ...'))
const deleteAppCacheReq = window.indexedDB.deleteDatabase('OneArmyCache')
deleteAppCacheReq.onsuccess = () => console.log('App cache cleared ...')

declare global {
  namespace Cypress {
    // tslint:disable-next-line:interface-name
    interface Chainable {
      login(
        username: string,
        password: string,
      ): Promise<firebase.auth.UserCredential>

      /**
       * Login and wait for the page to load completely with user info.
       * Some buttons are not shown in Cypress test after cy.login. This is a workaround for this problem.
       * Please use login whenever possible.
       * @deprecated
       * @param username
       * @param password
       */
      completeLogin(username: string, password: string): Chainable<void>

      logout(): Chainable<void>

      deleteDocuments(
        collectionName: string,
        fieldPath: string,
        opStr: any,
        value: string,
      ): Promise<void>

      updateDocument(
        collectionName: string,
        docId: string,
        docData: any,
      ): Promise<void>

      queryDocuments(
        collectionName: string,
        fieldPath: string,
        opStr: any,
        value: string,
      ): Chainable<any>

      step(message: string)

      uploadFiles(filePath: string | string[])

      toggleUserMenuOn(): Chainable<void>
      toggleUserMenuOff(): Chainable<void>

      /**
       * Trigger form validation
       */
      screenClick(): Chainable<void>

      clickMenuItem(menuItem: UserMenuItem): Chainable<void>
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
    fb.auth().signInWithEmailAndPassword(email, password)
  })

  Cypress.Commands.add('completeLogin', (email, password) => {
    Cypress.log({
      displayName: 'login',
      consoleProps: () => {
        return { email, password }
      },
    })
    fb.auth().signInWithEmailAndPassword(email, password)
    const isPageLoadedAfterLogin = () =>
      cy
        .get('[data-cy=user-menu]')
        .find('path')
        .should('be.exist')
    isPageLoadedAfterLogin()
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

  Cypress.Commands.add(
    'queryDocuments',
    (collectionName: string, fieldPath: string, opStr: any, value: string) => {
      Cypress.log({
        displayName: 'queryDocuments',
        consoleProps: () => {
          return { collectionName, fieldPath, opStr, value }
        },
      })
      return firestore.queryDocuments(collectionName, fieldPath, opStr, value)
    },
  )

  Cypress.Commands.add(
    'deleteDocuments',
    (collectionName: string, fieldPath: string, opStr: any, value: string) => {
      Cypress.log({
        displayName: 'deleteDocuments',
        consoleProps: () => {
          return { collectionName, fieldPath, opStr, value }
        },
      })
      return firestore.deleteDocuments(collectionName, fieldPath, opStr, value)
    },
  )

  Cypress.Commands.add(
    'updateDocument',
    (collectionName: string, docId: string, docData: any) => {
      Cypress.log({
        displayName: 'updateDocument',
        consoleProps: () => {
          return { collectionName, docId, docData }
        },
      })

      return firestore.updateDocument(collectionName, docId, docData)
    },
  )

  Cypress.Commands.add('step', (message: string) => {
    Cypress.log({
      displayName: 'step',
      message: `**${message}**`,
    })
  })

  const resolveMimeType = (filePath: string) => {
    const mimeTypeMapping = [['.jpg', 'image/jpg'], ['.png', 'image/png']]
    const [_, mimeType]: any = mimeTypeMapping.find(([ext]) =>
      filePath.endsWith(ext),
    )
    if (!mimeType) {
      throw new Error(`Please define the mime type for ${filePath} here!`)
    }
    return mimeType
  }
  Cypress.Commands.add(
    'uploadFiles',
    { prevSubject: 'element' },
    ($inputElement, filePath: string | string[]) => {
      const filePaths: string[] = []
      if (typeof filePath === 'string') {
        filePaths.push(filePath)
      } else {
        filePaths.push(...filePath)
      }
      const getContentReqs = filePaths.map(path => {
        return new Cypress.Promise(resolve => {
          return cy.fixture(path).then(fileContent => {
            resolve({
              fileName: path,
              mimeType: resolveMimeType(path),
              fileContent,
            })
          })
        })
      })

      Cypress.Promise.all(getContentReqs).then((fileData: FileData[]) => {
        cy.wrap($inputElement).upload(fileData)
      })
    },
  )

  Cypress.Commands.add('toggleUserMenuOn', () => {
    Cypress.log({ displayName: 'OPEN_USER_MENU' })
    cy.get('[data-cy=user-menu]')
      .find('path')
      .should('be.exist')
    cy.get('[data-cy=user-menu]').click()
  })

  Cypress.Commands.add('toggleUserMenuOff', () => {
    Cypress.log({ displayName: 'CLOSE_USER_MENU' })
    cy.get('[data-cy=header]').click({ force: true })
  })

  Cypress.Commands.add('clickMenuItem', (menuItem: UserMenuItem) => {
    Cypress.log({
      displayName: 'CLICK_MENU_ITEM',
      consoleProps: () => {
        return { menuItem }
      },
    })
    cy.toggleUserMenuOn()
    cy.get('[data-cy=menu-item]').contains(menuItem).click()
  })

  Cypress.Commands.add('screenClick', () => {
    cy.get('[data-cy=header]').click({ force: true })
  })

}

attachCustomCommands(Cypress, firebase)
