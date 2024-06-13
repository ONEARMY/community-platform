import { spawn, spawnSync } from 'child_process'
import { config } from 'dotenv'
import fs from 'fs-extra'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import waitOn from 'wait-on'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PLATFORM_ROOT_DIR = resolve(__dirname, '../../../')
const WORKSPACE_DIR = resolve(__dirname, '../')

const SRC_DB_ENDPOINTS = resolve(
  PLATFORM_ROOT_DIR,
  'src/stores/databaseV2/endpoints.ts',
)
const WORKSPACE_DB_ENDPOINTS = resolve(
  WORKSPACE_DIR,
  'src/support/db/endpoints.ts',
)
const CY_BIN = resolve(WORKSPACE_DIR, 'node_modules/.bin/cypress')
const CROSSENV_BIN = resolve(WORKSPACE_DIR, 'node_modules/.bin/cross-env')
const BUILD_SERVE_JSON = resolve(PLATFORM_ROOT_DIR, 'build/serve.json')

export const PATHS = {
  WORKSPACE_DIR,
  PLATFORM_ROOT_DIR,
  SRC_DB_ENDPOINTS,
  WORKSPACE_DB_ENDPOINTS,
  CY_BIN,
  CROSSENV_BIN,
  BUILD_SERVE_JSON,
}

export const generateAlphaNumeric = (length: number) => {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

const e2eEnv = config()

const isCi = process.argv.includes('ci')
const isProduction = process.argv.includes('prod')

// Prevent unhandled errors being silently ignored
process.on('unhandledRejection', (err) => {
  console.error('There was an uncaught error', err)
  process.exitCode = 1
})
/**
 * When running e2e tests with cypress we need to first get the server up and running
 * before launching the test suite. We will seed the DB from within the test suite
 *
 * @argument ci - specify if running in ci (e.g. circleci) to run and record
 * @argument prod - specify to use a production build instead of local development server
 * @example npm run test ci prod
 *
 * TODO: CC - 2021-02-24
 * - DB seeding happens inbetween test suites, but really should happen before/after test
 * scripts start and end (particularly teardown, as it won't be called if tests fail).
 * Possibly could be done with a Cypress.task or similar
 * Temp cli function to wipe hanging db: `firebase use ci; firebase firestore:delete --all-collections`
 */
main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })

async function main() {
  // copy endpoints for use in testing
  fs.copyFile(PATHS.SRC_DB_ENDPOINTS, PATHS.WORKSPACE_DB_ENDPOINTS)
  await startAppServer()
  runTests()
}

/** We need to ensure the platform is up and running before starting tests
 * There are npm packages like start-server-and-test but they seem to have flaky
 * performance in some environments (https://github.com/bahmutov/start-server-and-test/issues/250).
 * Instead manually track via child spawns
 *
 */
async function startAppServer() {
  const { CROSSENV_BIN, BUILD_SERVE_JSON } = PATHS
  // by default spawns will not respect colours used in stdio, so try to force
  const crossEnvArgs = `FORCE_COLOR=1 REACT_APP_SITE_VARIANT=test-ci`

  // run local debug server for testing unless production build specified
  let serverCmd = `${CROSSENV_BIN} ${crossEnvArgs} BROWSER=none yarn start-ci`

  // for production will instead serve from production build folder
  if (isProduction) {
    // create local build if not running on ci (which will have build already generated)
    if (!isCi) {
      // specify CI=false to prevent throwing lint warnings as errors
      spawnSync(`${CROSSENV_BIN} ${crossEnvArgs} CI=false yarn build`, {
        shell: true,
        stdio: ['inherit', 'inherit', 'pipe'],
      })
    }
    // create a rewrites file for handling local server behaviour
    const opts = { rewrites: [{ source: '/**', destination: '/index.html' }] }
    fs.writeFile(BUILD_SERVE_JSON, JSON.stringify(opts))

    serverCmd = `npx serve build -l 3456`
  }

  /******************* Run the main commands ******************* */
  // as the spawn will not terminate create non-async, and just listen to and handle messages
  // from the methods
  const child = spawn(serverCmd, {
    shell: true,
    stdio: ['pipe', 'pipe', 'inherit'],
    cwd: PATHS.PLATFORM_ROOT_DIR,
  })

  child.stdout.on('data', (d) => {
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

function runTests() {
  console.log(isCi ? 'Start tests' : 'Opening cypress for manual testing')
  const e = process.env
  const { CYPRESS_KEY } = e2eEnv.parsed
  const CI_BROWSER = e.CI_BROWSER || 'chrome'
  const CI_GROUP = e.CI_GROUP || '1x-chrome'
  // not currently used, but can pass variables accessed by Cypress.env()
  const CYPRESS_ENV = `DUMMY_VAR=1`
  // use workflow ID so that jobs running in parallel can be assigned to same cypress build
  // cypress will use this to split tests between parallel runs
  const buildId = e.CIRCLE_WORKFLOW_ID || generateAlphaNumeric(8)

  // main testing command, depending on whether running on ci machine or interactive local
  // call with path to bin as to ensure locally installed used
  const { CY_BIN, CROSSENV_BIN } = PATHS

  const testCMD = isCi
    ? `${CY_BIN} run --record --env ${CYPRESS_ENV} --key=${CYPRESS_KEY} --parallel --headless --browser ${CI_BROWSER} --group ${CI_GROUP} --ci-build-id ${buildId}`
    : `${CY_BIN} open --browser chrome --env ${CYPRESS_ENV}`

  console.log(`Running cypress with cmd: ${testCMD}`)

  const spawn = spawnSync(`${CROSSENV_BIN} FORCE_COLOR=1 ${testCMD}`, {
    shell: true,
    stdio: ['inherit', 'inherit', 'pipe'],
    cwd: PATHS.WORKSPACE_DIR,
  })
  console.log('testing complete with exit code', spawn.status)
  if (spawn.status === 1) {
    console.error('error', spawn.stderr.toString())
  }
  process.exit(spawn.status)
}
