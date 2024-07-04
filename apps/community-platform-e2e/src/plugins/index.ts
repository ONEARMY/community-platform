/* global console */

export function setupNodeEvents(on: Cypress.PluginEvents) {
  /**
   * Log console to terminal
   * https://github.com/cypress-io/cypress/issues/3199
   */
  on('task', {
    log(message) {
      console.log(message)
      return null
    },
  })
}
