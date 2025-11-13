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

  cy.task('seed database')

  localStorage.clear()
  cy.clearServiceWorkers()
})

afterEach(() => {
  // ensure all tests are also logged out (skip ui check in case page not loaded)
  cy.logout()
})

after(async () => {
  Cypress.log({
    displayName: 'Clearing database for tenant',
    message: process.env.TENANT_ID,
  })

  cy.task('clear database')
})
