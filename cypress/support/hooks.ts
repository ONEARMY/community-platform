import { Firestore } from './db/firebase'

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
  indexedDB.deleteDatabase('OneArmyCache')
  cy.clearLocalStorage('CLear local storage and indexDB')
  cy.wrap('Initialising Database').then({ timeout: 60000 }, doc => {
    // large initial timeout in case server slow to respond
    return new Cypress.Promise(async resolve => {
      await Firestore.seedDB()
      resolve(null)
    })
  })
})

// ensure all tests start logged out and with an active page
beforeEach(() => {
  cy.visit('/how-to')
  cy.logout()
})

/**
 * After all tests have completed delete all the documents that have
 * been added to the database
 */
after(() => {
  cy.wrap('Clearing Database').then({ timeout: 30000 }, () => {
    return new Cypress.Promise((resolve, reject) => {
      Firestore.clearDB()
        .then(() => resolve())
        .catch(() => resolve())
    })
  })
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
