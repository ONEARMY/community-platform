const cyTpPreProcessor = require('./cy-ts-preprocessor')

module.exports = (on) => {
  on('file:preprocessor', cyTpPreProcessor)
}
