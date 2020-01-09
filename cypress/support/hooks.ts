import { Firestore } from './db/firebase'

/**
 * Before all tests begin initialise database. This clears the browser
 * cache and seeds the database from the fixtures json
 * @remark - verbose syntax as no easy way to apply longer timeout
 * wait to custom command
 */
before(() => {
  cy.wrap('Initialising Database').then({ timeout: 20000 }, doc => {
    return new Cypress.Promise(resolve => {
      initialiseDB().then(() => {
        cy.log('DB Initialised')
        resolve(null)
      })
    })
  })
})
/**
 * After all tests have completed delete all the documents that have
 * been added to the database
 */
after(() => {
  cy.wrap('Clearing Database').then({ timeout: 20000 }, doc => {
    return new Cypress.Promise(async (resolve, reject) => {
      await Firestore.clearDB()
      // await clearDexieCache()
      resolve()
    })
  })
})
async function initialiseDB() {
  await clearDexieCache()
  await Firestore.seedDB()
}
/**
 * wrapper for indexeddb to clear Dexie
 */
function clearDexieCache() {
  return new Promise(resolve => {
    const deleteAppCacheReq = window.indexedDB.deleteDatabase('OneArmyCache')
    deleteAppCacheReq.onsuccess = () => resolve()
  })
}
