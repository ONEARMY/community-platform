/* global module, console */

module.exports = function (on) {
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
