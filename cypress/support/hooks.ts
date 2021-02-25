import { TestDB } from './db/firebase'
import { DB_PREFIX } from '../fixtures/seed'

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
  // Add error handlers
  // https://docs.cypress.io/api/utilities/promise.html#Rejected-test-promises-do-not-fail-tests
  window.addEventListener('unhandledrejection', event => {
    throw event.reason
  })
  Cypress.Promise.onPossiblyUnhandledRejection((error, promise) => {
    throw error
  })
  cy.clearServiceWorkers()
  // clear idb
  cy.deleteIDB('OneArmyCache')
  // cy.deleteIDB('firebaseLocalStorageDb')
  // seed db (ensure db_prefix available for seed)
  cy.setSessionStorage('DB_PREFIX', DB_PREFIX)
  cy.wrap('DB Init').then({ timeout: 60000 }, () => {
    // large initial timeout in case server slow to respond
    return new Cypress.Promise((resolve, reject) => {
      TestDB.seedDB(DB_PREFIX)
        .then(resolve)
        .catch(reject)
    })
  })
})

beforeEach(() => {
  // set the db_prefix variable on platform session storage (cypress wipes between tests)
  cy.setSessionStorage('DB_PREFIX', DB_PREFIX)
  // ensure all tests are also logged out (requires being on a page to check)
  cy.logout(false)
})

/**
 * After all tests have completed delete all the documents that have
 * been added to the database
 */
after(() => {
  cy.clearServiceWorkers()
  cy.wrap('Clearing Database').then({ timeout: 30000 }, () => {
    return new Cypress.Promise((resolve, reject) => {
      TestDB.clearDB(DB_PREFIX)
        .then(resolve)
        .catch(reject)
    })
  })
  // remove service workers at end of test set
})
