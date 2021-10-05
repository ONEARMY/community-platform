const wp = require('@cypress/webpack-preprocessor')
module.exports = function(on) {
  const options = {
    webpackOptions: require('../webpack.config'),
  }
  on('file:preprocessor', wp(options))

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
