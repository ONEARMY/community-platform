// Run a pre-flight check that developer environment setup in compatible way
const { envCheck } = require('./scripts/envCheck')
if (!process.env.CI) {
  envCheck()
}

// Specific settings to use when running anything that requires a webpack compiler
// Enabled when npm command specifies `env-cmd -e webpack`
let webpack = {
  NODE_OPTIONS: getNodeOptions(),
}

// Specific env to use with react-scripts / create-react-app
// Enabled when npm command specifies `env-cmd -e cra`
let cra = {
  ...webpack,
  FAST_REFRESH: false,
}

exports.cra = cra
exports.webpack = webpack

/** Determine what node_options to provide depending on context */
function getNodeOptions() {
  // Depending on node version use different environment variables to fix
  // specific build or run issues
  const NODE_VERSION = process.versions.node.split('.')[0]

  let NODE_OPTIONS = process.env.NODE_OPTIONS || ''

  // fix out-of-memory issues - default to 4GB but allow override from CI
  // NOTE - would like to auto-calculate but does not support CI (https://github.com/nodejs/node/issues/27170)
  if (!NODE_OPTIONS.includes('--max-old-space-size')) {
    NODE_OPTIONS += ` --max-old-space-size=4096`
  }
  if (NODE_VERSION > '17') {
    // fix https://github.com/facebook/create-react-app/issues/11708
    // https://github.com/facebook/create-react-app/issues/12431
    NODE_OPTIONS += ' --openssl-legacy-provider --no-experimental-fetch'
  }

  if (process.env.CI) {
    console.log('NODE_OPTIONS', NODE_OPTIONS, '\n')
  }
  return NODE_OPTIONS.trim()
}
