// Depending on node version use different environment variables to fix
// specific build or run issues

const NODE_VERSION = process.versions.node.split('.')[0]

// Specific env to use with react-scripts / create-react-app
// Enabled when npm command specifies `env-cmd -e cra`
let webpack4 = {}

if (NODE_VERSION === '18') {
  // fix https://github.com/facebook/create-react-app/issues/11708
  // https://github.com/facebook/create-react-app/issues/12431
  webpack4.NODE_OPTIONS = '--openssl-legacy-provider --no-experimental-fetch'
}

let cra = {
  ...webpack4,
  FAST_REFRESH: false,
  // fix https://github.com/facebook/create-react-app/issues/8944
  SKIP_PREFLIGHT_CHECK: true,
}

exports.cra = cra
exports.webpack4 = webpack4
