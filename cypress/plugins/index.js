const wp = require('@cypress/webpack-preprocessor')
module.exports = function(on) {
  require('cypress-plugin-retries/lib/plugin')(on)
  const options = {
    webpackOptions: require('../webpack.config'),
  }
  on('file:preprocessor', wp(options))
}
