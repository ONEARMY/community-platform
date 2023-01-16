// Run a pre-flight check that developer environment setup in compatible way
const { envCheck } = require('./scripts/envCheck')
envCheck()

// Depending on node version use different environment variables to fix
// specific build or run issues

const NODE_VERSION = process.versions.node.split('.')[0]

// Specific settings to use when running anything that requires a webpack compiler
// Enabled when npm command specifies `env-cmd -e webpack`
let webpack = {
  // fix out-of-memory issues
  NODE_OPTIONS: '--max-old-space-size=4096',
}
if (NODE_VERSION > '17') {
  // fix https://github.com/facebook/create-react-app/issues/11708
  // https://github.com/facebook/create-react-app/issues/12431
  webpack.NODE_OPTIONS += ' --openssl-legacy-provider --no-experimental-fetch'
}

// Specific env to use with react-scripts / create-react-app
// Enabled when npm command specifies `env-cmd -e cra`
let cra = {
  ...webpack,
  FAST_REFRESH: false,
}

exports.cra = cra
exports.webpack = webpack
