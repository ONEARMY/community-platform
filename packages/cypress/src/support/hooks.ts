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
    Cypress.env('DB_PREFIX', `${process.env.DB_PREFIX}`)
  }
  // Add error handlers
  // https://docs.cypress.io/api/utilities/promise.html#Rejected-test-promises-do-not-fail-tests
  window.addEventListener('unhandledrejection', (event) => {
    throw event.reason
  })
  Cypress.Promise.onPossiblyUnhandledRejection((error) => {
    throw error
  })
  cy.clearServiceWorkers()
  // clear idb
  cy.deleteIDB('OneArmyCache')
  // cy.deleteIDB('firebaseLocalStorageDb')
})

beforeEach(() => {
  // set the db_prefix variable on platform session storage (cypress wipes between tests)
  cy.setSessionStorage('DB_PREFIX', Cypress.env('DB_PREFIX'))
})

afterEach(() => {
  // ensure all tests are also logged out (skip ui check in case page not loaded)
  cy.logout(false)
})
