// Depending on node version use different environment variables to fix
// specific build or run issues

const NODE_VERSION = process.versions.node.split('.')[0]

// Specific settings to use when running anything that requires a webpack4 compiler
// Enabled when npm command specifies `env-cmd -e webpack4`
let webpack4 = {}
if (NODE_VERSION === '18') {
  // fix https://github.com/facebook/create-react-app/issues/11708
  // https://github.com/facebook/create-react-app/issues/12431
  webpack4.NODE_OPTIONS = '--openssl-legacy-provider --no-experimental-fetch'
}

// Specific env to use with react-scripts / create-react-app
// Enabled when npm command specifies `env-cmd -e cra`
let cra = {
  FAST_REFRESH: false,
}

exports.cra = cra
exports.webpack4 = webpack4
