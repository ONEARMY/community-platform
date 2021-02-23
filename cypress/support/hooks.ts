import { Firestore } from './db/firebase'

/**
 * Before all tests begin seed the database. CY runs this before all specs.
 * Note, cy also automatically will clear browser caches.
 * https://docs.cypress.io/api/commands/clearlocalstorage.html
 * @remark - verbose syntax as no easy way to apply longer timeout
 * wait to custom command
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
  // ensure platform has passed firebase instance data
  cy.visit('how-to')
  cy.window()
    .its('firebaseInstance')
    .should('exist')
})

/**
 * After all tests have completed delete all the documents that have
 * been added to the database
 */
after(() => {
  cy.wrap('Clearing Database').then({ timeout: 20000 }, doc => {
    return new Cypress.Promise(async (resolve, reject) => {
      await Firestore.clearDB()
      resolve()
    })
  })
})

// TODO - if running production builds locally may also need to remove service workers between runs
function clearServiceWorkers(w: Window) {
  if (w.navigator && navigator.serviceWorker) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => {
        registration.unregister()
      })
    })
  }
}
