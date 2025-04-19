import { clearDatabase } from '../utils/TestUtils'
import { seedAccounts } from './seedAccounts'
import { seedNews } from './seedNews'
import { seedQuestions, seedTags } from './seedQuestions'
import { seedResearch } from './seedResearch'

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
    // await clearDatabase(
    //   ['categories', 'comments', 'news', 'profiles', 'questions', 'tags'],
    //   Cypress.env('TENANT_ID'),
    // )

    const { profiles } = await seedAccounts()
    const { tags } = await seedTags()

    await seedQuestions(profiles)
    await seedNews(profiles, tags)
    await seedResearch(profiles, tags)
  })
  localStorage.clear()
  cy.clearServiceWorkers()
  cy.deleteIDB('OneArmyCache')
})

afterEach(() => {
  // ensure all tests are also logged out (skip ui check in case page not loaded)
  cy.logout()
})

after(async () => {
  Cypress.log({
    displayName: 'Clearing database for tenant',
    message: Cypress.env('TENANT_ID'),
  })
  await clearDatabase(
    [
      'categories',
      'comments',
      'news',
      'research',
      'research_updates',
      'profiles',
      'questions',
      'tags',
    ],
    Cypress.env('TENANT_ID'),
  )
})
