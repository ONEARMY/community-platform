const child = require('child_process')
const e2eEnv = require('dotenv').config({ path: `${process.cwd()}/.env.e2e` })

// Prevent errors being silently ignored
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
 * @argument ci - specify if running in ci (e.g. travis) to run and record
 * @example npm run test:e2e ci
 */
async function main() {
  const isCi = process.argv[2] === 'ci'
  const DB_PREFIX = `${randomString(5)}_`
  const sharedEnv = `REACT_APP_DB_PREFIX=${DB_PREFIX} REACT_APP_SITE_VARIANT=test-ci`
  const cyEnv = getCypressEnv(sharedEnv)
  const appStart = `cross-env ${sharedEnv} BROWSER=none PORT=3456 npm run start`
  const waitForStart = 'http-get://localhost:3456'
  const testStart = isCi
    ? //   TODO - cypress specific environment to be moved to other environment
      `npx cypress run --record --env ${cyEnv.runtime} --key=${cyEnv.CYPRESS_KEY} --parallel --headless --browser $CI_BROWSER --group $CI_GROUP --ci-build-id $TRAVIS_BUILD_ID`
    : `npx cypress open --browser chrome --env ${cyEnv.runtime}`
  const spawn = child.spawnSync(
    `npx start-test "${appStart}" "${waitForStart}" "${testStart}"`,
    {
      shell: true,
      stdio: ['inherit'],
    },
  )
  console.log('test complete')
  console.log(spawn)
  // as stderr stdio inherited (above) need to manually set exit code on fail
  if (spawn.status === 1) {
    process.exitCode = 1
  }
}
main()

/**
 * when passing an environment to cypress we will require a mix of both runtime
 * and own e2e env. The runtime env is passed as comma-separated list and will
 * be made available via Cypress.env()
 */
function getCypressEnv(sharedEnv) {
  return {
    ...e2eEnv.parsed,
    runtime: sharedEnv.replace(/ /g, ','),
  }
}

function randomString(length) {
  var result = ''
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}
