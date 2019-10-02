const cyTpPreProcessor = require('./cy-ts-preprocessor')
const cypressFirebasePlugin = require('cypress-firebase').plugin

module.exports = (on, config) => {
  on('file:preprocessor', cyTpPreProcessor)
  return cypressFirebasePlugin(config)
}
