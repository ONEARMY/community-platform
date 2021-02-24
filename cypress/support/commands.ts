import 'cypress-file-upload'
import { Firestore, firebase, Auth } from './db/firebase'

export enum UserMenuItem {
  Profile = 'Profile',
  Settings = 'Settings',
  LogOut = 'Logout',
}

declare global {
  namespace Cypress {
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
   */
  Cypress.Commands.add('login', (email: string, password: string) => {
    Cypress.log({
      displayName: 'login',
      consoleProps: () => {
        return { email, password }
      },
    })
    cy.wrap('logging in')
      .then(() => {
        return new Cypress.Promise(async (resolve, reject) => {
          Auth.signInWithEmailAndPassword(email, password)
            .then(res => resolve(res.user))
            .catch(reject)
        })
      })
      // after login ensure the auth user matches expected and user menu visable
      .its('email')
      .should('eq', email)
    cy.get('[data-cy=user-menu]')
    cy.log('user', Auth.currentUser)
  })

  Cypress.Commands.add('logout', () => {
    cy.wrap('logging out').then(() => {
      return new Cypress.Promise(async (resolve, reject) => {
        if (Auth.currentUser) {
          Auth.signOut().then(() => resolve())
        } else {
          resolve()
        }
      })
    })
  })
  Cypress.Commands.add('deleteCurrentUser', () => {
    return new Cypress.Promise((resolve, reject) => {
      if (Auth.currentUser) {
        Auth.currentUser
          .delete()
          .then(() => resolve(null))
          .catch(err => {
            console.error(err)
            reject(err)
          })
      } else {
        resolve(null)
      }
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
