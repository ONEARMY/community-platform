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

  // fix out-of-memory issues - dynamically set max available memory based on machine
  // use up to 4GB locally, and 90 % machine max when running on CI, loosely based on
  // https://github.com/cloudfoundry/nodejs-buildpack/pull/82
  if (!NODE_OPTIONS.includes('--max-old-space-size')) {
    let maxSize = 4096
    if (process.env.CI) {
      const totalMem =
        require('v8').getHeapStatistics().total_heap_size / (1024 * 1024)
      maxSize = Math.floor(totalMem * 0.9)
    }
    NODE_OPTIONS += ` --max-old-space-size=${maxSize}`
  }
  if (NODE_VERSION > '17') {
    // fix https://github.com/facebook/create-react-app/issues/11708
    // https://github.com/facebook/create-react-app/issues/12431
    NODE_OPTIONS += ' --openssl-legacy-provider --no-experimental-fetch'
  }
  if (process.env.CI) {
    console.log(NODE_OPTIONS)
    process.exit(1)
  }

  return NODE_OPTIONS.trim()
}
