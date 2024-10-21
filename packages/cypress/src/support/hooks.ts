// import { TestDB } from './db/firebase'

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
  window.addEventListener('unhandledrejection', (event) => {
    throw event.reason
  })
  Cypress.Promise.onPossiblyUnhandledRejection((error) => {
    throw error
  })
  cy.clearServiceWorkers()
  cy.deleteIDB('OneArmyCache')

  // cy.wrap('DB Init').then({ timeout: 120000 }, () => {
  //   // large initial timeout in case server slow to respond
  //   return new Cypress.Promise((resolve, reject) => {
  //     // force resolve in case of server issues (sometimes a bit flaky)
  //     setTimeout(() => {
  //       resolve()
  //     }, 10000)
  //     // seed the database
  //     TestDB.seedDB().then(resolve).catch(reject)
  //   })
  // })
})

afterEach(() => {
  // ensure all tests are also logged out (skip ui check in case page not loaded)
  cy.logout(false)
})
