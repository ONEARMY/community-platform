import { MOCK_DATA } from '../data'
import { clearDatabase, signUp } from './commands'
import { seedCategories, seedQuestions } from './seedQuestions'

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
  cy.then(async () => {
    await seedCategories()
    await seedQuestions()

    const accounts = Object.values(MOCK_DATA.users)
      .filter((x) => !!x['password'] && !!x['email'] && !!x.userName)
      .map((user) => ({
        email: user['email'],
        username: user.userName,
        password: user['password'],
      }))

    await Promise.all(
      accounts.map((user) => signUp(user.email, user.username, user.password)),
    )
  })
  localStorage.clear()
  cy.clearServiceWorkers()
  cy.deleteIDB('OneArmyCache')
})

afterEach(() => {
  // ensure all tests are also logged out (skip ui check in case page not loaded)
  cy.logout(false)
})

after(() => {
  const tenantId = Cypress.env('TENANT_ID')
  Cypress.log({
    displayName: 'Clearing database for tenant',
    message: tenantId,
  })
  clearDatabase(
    ['profiles', 'questions', 'comments', 'categories', 'tags'],
    tenantId,
  )
})
