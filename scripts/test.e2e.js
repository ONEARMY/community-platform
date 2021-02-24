const child = require('child_process')
const e2eEnv = require('dotenv').config({ path: `${process.cwd()}/.env.e2e` })
const fs = require('fs-extra')
const waitOn = require('wait-on')

const DB_PREFIX = `${randomString(5)}_`

// Prevent unhandled errors being silently ignored
process.on('unhandledRejection', err => {
  console.error('There was an uncaught error', err)
  process.exitCode = 1
})
/**
 * When running e2e tests with cypress we need to first get the server up and running
 * before launching the test suite. Additionally we will pass a random DB_PREFIX variable
 * to both the tests and platform which will provide a unique set seed data on the db
 * to work with (and avoid parallel tests accidentally overwriting each other).
 *
 * @argument ci - specify if running in ci (e.g. travis/circleci) to run and record
 * @argument prod - specify to use a production build instead of local development server
 * @example npm run test ci prod
 */
async function main() {
  // copy endpoints for use in testing
  fs.copyFileSync(
    'src/stores/databaseV2/endpoints.ts',
    'cypress/support/db/endpoints.ts',
  )

  await startAppServer()
  runTests()
}
main()

function runTests() {
  const isCi = process.argv.includes('ci')
  console.log(isCi ? 'Start tests' : 'Opening cypress for manual testing')
  const e = process.env
  const { CYPRESS_KEY } = e2eEnv.parsed
  const CI_BROWSER = e.CI_BROWSER || 'chrome'
  const CI_GROUP = e.CI_GROUP || '1x-chrome'
  // cypress env is also shared to the platform via window.cypress
  const CYPRESS_ENV = `DB_PREFIX=${DB_PREFIX}`
  // keep compatibility with both circleci and travisci builds - note, could pass as env variable instead
  const buildId = e.CIRCLE_WORKFLOW_ID || e.TRAVIS_BUILD_ID || randomString(8)

  // main testing command, depending on whether running on ci machine or interactive local
  const testCMD = isCi
    ? `npx cypress run --record --env ${CYPRESS_ENV} --key=${CYPRESS_KEY} --parallel --headless --browser ${CI_BROWSER} --group ${CI_GROUP} --ci-build-id ${buildId}`
    : `npx cypress@6.4.0 open --browser chrome --env ${CYPRESS_ENV}`

  const spawn = child.spawnSync(`cross-env FORCE_COLOR=1 ${testCMD}`, {
    shell: true,
    stdio: ['inherit', 'inherit', 'pipe'],
  })
  console.log('testing complete with exit code', spawn.status)
  process.exit(spawn.status)
}

/** We need to ensure the platform is up and running before starting tests
 * There are npm packages like start-server-and-test but they seem to have flaky
 * performance in some environments (https://github.com/bahmutov/start-server-and-test/issues/250).
 * Instead manually track via child spawns
 *
 */
async function startAppServer() {
  const useProductionBuild = process.argv.includes('prod')
  // by default spawns will not respect colours used in stdio, so try to force
  const crossEnvArgs = `FORCE_COLOR=1 REACT_APP_SITE_VARIANT=test-ci REACT_APP_DB_PREFIX=${DB_PREFIX}`
  let serverCmd = `cross-env ${crossEnvArgs} BROWSER=none PORT=3456 npm run start`
  // TODO - production builds currently fail tests as they require communication with the window object,
  // which will not be populated correctly when loaded from a service worker. Need to change how data is shared bewteen
  // cypress and the running platform (e.g. query params)
  if (useProductionBuild) {
    child.spawnSync(`cross-env ${crossEnvArgs} npm run build`, {
      shell: true,
      stdio: ['inherit', 'inherit', 'pipe'],
    })
    // when serving locally make sure all routes are redirected to index
    const opts = { rewrites: [{ source: '/**', destination: '/index.html' }] }
    fs.writeFileSync('build/serve.json', JSON.stringify(opts))
    serverCmd = `npx serve build -l 3456`
  }

  // as the spawn will not terminate create non-async, and just listen to and handle messages
  // from the methods
  const spawn = child.spawn(serverCmd, {
    shell: true,
    stdio: ['pipe', 'pipe', 'inherit'],
  })

  spawn.stdout.on('data', d => {
    const msg = d.toString('utf8')
    console.log(msg)
    // throw typescript build errors
    if (msg.includes('Failed to compile')) {
      // the server will still be running after compile failure (waiting for changes),
      // so give time for any other messages to come through before exiting manually
      setTimeout(() => {
        process.exit(1)
      }, 2000)
    }
  })
  // do not end function until server responsive on port 3456
  // give up if not reponsive after 5 minutes (assume uncaught error somewhere)
  const timeout = 5 * 60 * 1000
  await waitOn({ resources: ['http-get://localhost:3456'], timeout })
}

function randomString(length) {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}
