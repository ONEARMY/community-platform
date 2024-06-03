import 'cypress-file-upload'

import { deleteDB } from 'idb'

import { Auth, TestDB } from './db/firebase'

import type { firebase } from './db/firebase'

declare global {
  namespace Cypress {
    interface Chainable {
      deleteIDB(name: string): Promise<boolean>
      clearServiceWorkers(): Promise<void>
      setSessionStorage(key: string, value: string): Promise<void>
      /** login with firebase credentials, optionally check ui login element updated*/
      login(
        username: string,
        password: string,
        checkUI?: boolean,
      ): Promise<firebase.auth.UserCredential>

      /** logout of firebase, optionally check ui login element updated*/
      logout(checkUI?: boolean): Chainable<void>

      deleteCurrentUser(): Promise<void>

      queryDocuments(
        collectionName: string,
        fieldPath: string,
        opStr: any,
        value: string,
      ): Chainable<any[]>

      step(message: string)

      interceptAddressSearchFetch(addressResponse): Chainable<void>

      interceptAddressReverseFetch(addressResponse): Chainable<void>
    }
  }
}

/**
 * Create custom commands that can be used within cypress chaining and namespace
 * @remark - any called functions should be 'wrapped' in a cy.wrap('some name') statement to allow chaining
 * @remark - async code should be wrapped in a Cypress.promise block to allow the resolved promise to be
 * used in chained results
 */
const firestore = TestDB
/** Delete an indexeddb - resolving true on success and false if blocked (open connections) */
Cypress.Commands.add('deleteIDB', (name: string) => {
  cy.wrap('Delete Firebase IDB: ' + name)
    .then(() => {
      return new Cypress.Promise<boolean>((resolve) => {
        // Ensure DB exists - NOTE - only supported in chrome
        // ;(indexedDB as any).databases().then((names: string[]) => {
        //   if (names.includes(name)) {
        deleteDB(name, {
          // blocked implies active connection; for now just resolve false but in the
          // future may want to find better resolution
          blocked: () => resolve(false),
        })
          .then(() => resolve(true))
          .catch(() => resolve(false))
      })
    })
    .then((deleted) => cy.log('deleted?', deleted))
})

Cypress.Commands.add('setSessionStorage', (key: string, value: string) => {
  cy.wrap(`setSessionStorage - ${key}:${value}`).then(() => {
    cy.window().its('sessionStorage').invoke('setItem', key, value)
    cy.window().its('sessionStorage').invoke('getItem', key).should('eq', value)
  })
})

Cypress.Commands.add('clearServiceWorkers', () => {
  cy.window().then((w) => {
    cy.wrap('Clearing service workers').then(() => {
      return new Cypress.Promise((resolve) => {
        // if running production builds locally may also need to remove service workers between runs
        if (w.navigator && navigator.serviceWorker) {
          navigator.serviceWorker.getRegistrations().then((registrations) => {
            registrations.forEach((registration) => {
              registration.unregister()
            })
            resolve()
          })
        } else {
          resolve()
        }
      })
      cy.log('user', Auth.currentUser)
    })
  })

  Cypress.Commands.add('logout', (checkUI = true) => {
    cy.wrap('logging out').then(() => {
      return new Cypress.Promise((resolve) => {
        Auth.signOut().then(() => resolve())
      })
    })
    cy.wrap(checkUI ? 'check logout ui' : 'skip ui check').then(() => {
      if (checkUI) {
        cy.get('[data-cy=login]')
      }
    })
  })
})

/**
 * Login and logout commands use the sytem interface to log a user in or out
 */
Cypress.Commands.add(
  'login',
  (email: string, password: string, checkUI = true) => {
    Cypress.log({
      displayName: 'login',
      consoleProps: () => {
        return { email, password }
      },
    })
    // use a wrap statement to allow chaining onto an async function
    cy.wrap('logging in')
      .then(() => {
        return new Cypress.Promise((resolve, reject) => {
          Auth.signInWithEmailAndPassword(email, password)
            .then((res) => resolve(res.user))
            .catch(reject)
        })
      })
      // after login ensure the auth user matches expected and user menu visible
      .its('email')
      .should('eq', email)
    cy.wrap(checkUI ? 'check login ui' : 'skip ui check').then(() => {
      if (checkUI) {
        // cy.get('[data-cy=user-menu]').should('be.visible')
      }
    })
    cy.log('user', Auth.currentUser)
  },
)

Cypress.Commands.add('logout', (checkUI = true) => {
  cy.wrap('logging out').then(() => {
    return new Cypress.Promise((resolve) => {
      Auth.signOut().then(() => resolve())
    })
  })
  cy.wrap(checkUI ? 'check logout ui' : 'skip ui check').then(() => {
    if (checkUI) {
      cy.get('[data-cy=login]')
    }
  })
})

Cypress.Commands.add('deleteCurrentUser', () => {
  return new Cypress.Promise((resolve, reject) => {
    if (Auth.currentUser) {
      Auth.currentUser
        .delete()
        .then(() => resolve(null))
        .catch((err) => {
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

Cypress.Commands.add('step', (message: string) => {
  Cypress.log({
    displayName: 'step',
    message: [`**${message}**`],
  })
})

Cypress.Commands.add('interceptAddressSearchFetch', (addressResponse) => {
  cy.intercept('GET', 'https://nominatim.openstreetmap.org/search*', {
    body: addressResponse,
  }).as('fetchAddress')
})

Cypress.Commands.add('interceptAddressReverseFetch', (addressResponse) => {
  cy.intercept('GET', 'https://nominatim.openstreetmap.org/reverse?*', {
    body: addressResponse,
  }).as('fetchAddressReverse')
})

/**
 * Overwrite default logging to also output to console
 * https://github.com/cypress-io/cypress/issues/3199
 */
Cypress.Commands.overwrite('log', (subject, message) => cy.task('log', message))
