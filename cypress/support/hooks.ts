import { TestDB } from './db/firebase'
import { DB_ENDPOINTS } from './db/endpoints'

/**
 * Before all tests begin seed the database. CY runs this before all specs.
 * Note, cy also automatically will clear browser caches.
 * https://docs.cypress.io/api/commands/clearlocalstorage.html
 *
 * The should not be confused with beforeAll which is run before each test.
 * Additionally any aliases created in before will not be passed to test instance,
 * put aliases created in beforeAll will be (not currently required)
 */
before(() => {
  cy.deleteIDB('OneArmyCache')
  cy.deleteIDB('firebaseLocalStorageDb')
  cy.log('DB Prefix', DB_ENDPOINTS.howtos.substring(0, 5))
  cy.wrap('DB Init').then({ timeout: 60000 }, doc => {
    // large initial timeout in case server slow to respond
    return new Cypress.Promise(async resolve => {
      await TestDB.seedDB()
      resolve(null)
    })
  })
})

// ensure all tests are also logged out (requires being on a page to check)
beforeEach(() => {
  cy.logout(false)
})

/**
 * After all tests have completed delete all the documents that have
 * been added to the database
 */
after(() => {
  cy.wrap('Clearing Database').then({ timeout: 30000 }, () => {
    return new Cypress.Promise((resolve, reject) => {
      TestDB.clearDB()
        .then(() => resolve())
        .catch(() => resolve())
    })
  })
  // remove service workers at end of each test set
  // NOTE - these should not be enabled (included exception for port 3456)
  // as can cause race condition to fail where cypress not loaded before platform started
  cy.window().then(w => {
    cy.wrap('Clearing service workers').then(() => {
      return new Cypress.Promise(async resolve => {
        // if running production builds locally may also need to remove service workers between runs
        if (w.navigator && navigator.serviceWorker) {
          navigator.serviceWorker.getRegistrations().then(registrations => {
            registrations.forEach(registration => {
              registration.unregister()
            })
            resolve()
          })
        } else {
          resolve()
        }
      })
    })
  })
})
