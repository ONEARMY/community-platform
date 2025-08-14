import { clearDatabase, clearStorage, createStorage } from '../utils/TestUtils'
import { seedAccounts } from './seedAccounts'
import { seedBadges } from './seedBadges'
import { seedLibrary } from './seedLibrary'
import { seedMap } from './seedMap'
import { seedNews } from './seedNews'
import {
  seedProfileTags,
  seedProfileTypes,
  seedQuestions,
  seedTags,
} from './seedQuestions'
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
    await createStorage(Cypress.env('TENANT_ID'))

    const { profile_types } = await seedProfileTypes()
    const { profile_badges } = await seedBadges()
    const { profile_tags } = await seedProfileTags()
    const { profiles } = await seedAccounts(
      profile_badges.data,
      profile_tags.data,
      profile_types.data,
    )

    await seedMap(profiles)

    const { tags } = await seedTags()
    await seedQuestions(profiles)
    await seedNews(profiles, tags)
    await seedResearch(profiles, tags)
    await seedLibrary(profiles, tags)
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
      'projects',
      'project_steps',
      'tags',
      'profile_badges',
      'profile_badges_relations',
      'profile_tags',
      'profile_tags_replations',
      'profile_types',
    ],
    Cypress.env('TENANT_ID'),
  )

  await clearStorage(Cypress.env('TENANT_ID'))
})
