import { TestDB } from './db/firebase'

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
  if (!Cypress.env('DB_PREFIX')) {
    Cypress.env('DB_PREFIX', `${randomString(5)}_`)
  }

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
  cy.setSessionStorage('DB_PREFIX', Cypress.env('DB_PREFIX'))
  cy.wrap('DB Init').then({ timeout: 120000 }, () => {
    // large initial timeout in case server slow to respond
    return new Cypress.Promise((resolve, reject) => {
      // force resolve in case of server issues (sometimes a bit flaky)
      setTimeout(() => {
        resolve()
      }, 10000)
      // seed the database
      TestDB.seedDB()
        .then(resolve)
        .catch(reject)
    })
  })
  // the seeddb function returns an array of [db_key, db_data] entries
  // ensure each db_key contains the correct db prefix and is not empty
  // .each(data => {
  //   cy.wrap(data).should(entry => {
  //     expect(entry[0]).contains(Cypress.env('DB_PREFIX'))
  //     expect(entry[1]).length.greaterThan(0)
  //   })
  // })
})

beforeEach(() => {
  // set the db_prefix variable on platform session storage (cypress wipes between tests)
  cy.setSessionStorage('DB_PREFIX', Cypress.env('DB_PREFIX'))
  // ensure all tests are also logged out (requires being on a page to check)
  cy.logout(false)
})

/**
 * After all tests have completed delete all the documents that have
 * been added to the database
 */
after(() => {
  cy.clearServiceWorkers()
  cy.wrap('Clear DB').then({ timeout: 120000 }, () => {
    return new Cypress.Promise((resolve, reject) => {
      // force resolve in case of server issues (sometimes a bit flaky)
      setTimeout(() => {
        resolve()
      }, 10000)
      // clear the database
      TestDB.clearDB().then(
        () => resolve(),
        err => reject(err),
      )
    })
  })
  // remove service workers at end of test set
})

function randomString(length: number) {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}
