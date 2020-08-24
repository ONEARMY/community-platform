import 'cypress-file-upload'
import { Firestore, Auth as AuthNative, firebase } from './db/firebase'
import FileData = Cypress.FileData

export enum UserMenuItem {
  Profile = 'Profile',
  Settings = 'Settings',
  LogOut = 'Logout',
}

declare global {
  namespace Cypress {
    // tslint:disable-next-line:interface-name
    interface Chainable {
      login(
        username: string,
        password: string,
      ): Promise<firebase.auth.UserCredential>

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

      deleteCurrentUser(): Promise<void>

      queryDocuments(
        collectionName: string,
        fieldPath: string,
        opStr: any,
        value: string,
      ): Chainable<any>

      step(message: string)

      attachFile(filePath: string)

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

const attachCustomCommands = (Cypress: Cypress.Cypress) => {
  const firestore = Firestore
  /**
   * Login and logout commands use the sytem interface to log a user in or out
   * @remark - we want to hook directly into firebase auth, however there are 2 instances
   * running on the parent (cypress/node) and child (platform/web) instances
   * Therefore an extra method has been added in the platform to make it's instance
   * available via the window object.
   * @remark - note, we don't bind the reverse (full cypress firebase inherited by platform)
   * as node and web handle objects differently, and throw errors when trying to save to firestore
   * (web strips __proto__ but node keeps, resulting in error). We could however pass just the auth
   * down to child using Cypress.env
   */
  Cypress.Commands.add('login', (email: string, password: string) => {
    Cypress.log({
      displayName: 'login',
      consoleProps: () => {
        return { email, password }
      },
    })
    cy.window().then((win: any) => {
      const childFB = win.firebaseInstance as typeof firebase
      const Auth = childFB.auth()
      return new Cypress.Promise((resolve, reject) => {
        Auth.signInWithEmailAndPassword(email, password)
          .then(resolve)
          .catch(reject)
      })
    })
  })

  Cypress.Commands.add('logout', () => {
    cy.window().then((win: any) => {
      const childFB = win.firebaseInstance as typeof firebase
      const Auth = childFB.auth()
      return new Cypress.Promise((resolve, reject) => {
        Auth.signOut()
          .then(resolve)
          .catch(reject)
      })
    })
  })
  Cypress.Commands.add('deleteCurrentUser', () => {
    cy.window().then((win: any) => {
      const childFB = win.firebaseInstance as typeof firebase
      const Auth = childFB.auth()
      return new Cypress.Promise((resolve, reject) => {
        if (Auth.currentUser) {
          Auth.currentUser
            .delete()
            .then(resolve)
            .catch(reject)
        } else {
          resolve(null)
        }
      })
    })
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
      message: [`**${message}**`],
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

  Cypress.Commands.add('toggleUserMenuOn', () => {
    Cypress.log({ displayName: 'OPEN_USER_MENU' })
    cy.get('[data-cy=user-menu]').should('be.exist')
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
    cy.get(`[data-cy=menu-${menuItem}]`).click()
  })

  Cypress.Commands.add('screenClick', () => {
    cy.get('[data-cy=header]').click({ force: true })
  })
}

attachCustomCommands(Cypress)
