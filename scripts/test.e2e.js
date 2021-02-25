const child = require('child_process')
const e2eEnv = require('dotenv').config({ path: `${process.cwd()}/.env.e2e` })
const fs = require('fs-extra')
const waitOn = require('wait-on')

const isCi = process.argv.includes('ci')
const useProductionBuild = process.argv.includes('prod')

// Prevent unhandled errors being silently ignored
process.on('unhandledRejection', err => {
  console.error('There was an uncaught error', err)
  process.exitCode = 1
})
/**
 * When running e2e tests with cypress we need to first get the server up and running
 * before launching the test suite. We will seed the DB from within the test suite
 *
 * @argument ci - specify if running in ci (e.g. travis/circleci) to run and record
 * @argument prod - specify to use a production build instead of local development server
 * @example npm run test ci prod
 *
 * TODO: CC - 2021-02-24
 * - DB seeding happens inbetween test suites, but really should happen before/after test
 * scripts start and end (particularly teardown, as it won't be called if tests fail).
 * Possibly could be done with a Cypress.task or similar
 * Temp cli function to wipe hanging db: `firebase use ci; firebase firestore:delete --all-collections`
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
  console.log(isCi ? 'Start tests' : 'Opening cypress for manual testing')
  const e = process.env
  const { CYPRESS_KEY } = e2eEnv.parsed
  const CI_BROWSER = e.CI_BROWSER || 'chrome'
  const CI_GROUP = e.CI_GROUP || '1x-chrome'
  // not currently used, but can pass variables accessed by Cypress.env()
  const CYPRESS_ENV = `DUMMY_VAR=1`
  // keep compatibility with both circleci and travisci builds - note, could pass as env variable instead
  const buildId = e.CIRCLE_WORKFLOW_ID || e.TRAVIS_BUILD_ID || randomString(8)

  // main testing command, depending on whether running on ci machine or interactive local
  // call with path to bin as to ensure locally installed used
  const testCMD = isCi
    ? `./node_modules/.bin/cypress run --record --env ${CYPRESS_ENV} --key=${CYPRESS_KEY} --parallel --headless --browser ${CI_BROWSER} --group ${CI_GROUP} --ci-build-id ${buildId}`
    : `./node_modules/.bin/cypress open --browser chrome --env ${CYPRESS_ENV}`

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
  // by default spawns will not respect colours used in stdio, so try to force
  const crossEnvArgs = `FORCE_COLOR=1 REACT_APP_SITE_VARIANT=test-ci`

  // run local debug server for testing unless production build specified
  let serverCmd = `cross-env ${crossEnvArgs} BROWSER=none PORT=3456 npm run start`

  // for production will instead serve from production build folder
  if (useProductionBuild) {
    // create local build if not running on ci (which will have build already generated)
    if (!isCi) {
      // specify CI=false to prevent throwing lint warnings as errors
      child.spawnSync(`cross-env ${crossEnvArgs} CI=false npm run build`, {
        shell: true,
        stdio: ['inherit', 'inherit', 'pipe'],
      })
    }
    // create a rewrites file for handling local server behaviour
    const opts = { rewrites: [{ source: '/**', destination: '/index.html' }] }
    fs.writeFileSync('build/serve.json', JSON.stringify(opts))
    serverCmd = `npx serve build -l 3456`
  }

  /******************* Run the main commands ******************* */
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
