const child = require('child_process')
const e2eEnv = require('dotenv').config({ path: `${process.cwd()}/.env.e2e` })
const fs = require('fs')

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
 * @argument ci - specify if running in ci (e.g. travis) to run and record
 * @example npm run test ci
 */
async function main() {
  const isCi = process.argv[2] === 'ci'
  const DB_PREFIX = `${randomString(5)}_`
  // we want both cypress and the build to use some of the same build configuration, so define and share
  const sharedEnv = `REACT_APP_DB_PREFIX=${DB_PREFIX} REACT_APP_SITE_VARIANT=test-ci`
  // copy endpoints for use in testing
  fs.copyFileSync(
    'src/stores/databaseV2/endpoints.ts',
    'cypress/support/db/endpoints.ts',
  )
  const cyEnv = getCypressEnv(sharedEnv)
  // keep compatibility with both circleci and travisci builds - note, could pass as env variable instead
  const buildId = process.env.CIRCLE_WORKFLOW_ID || process.env.TRAVIS_BUILD_ID
  const serverStart = `npx serve build -l 3456`
  const testStart = isCi
    ? `npx cypress run --record --env ${cyEnv.runtime} --key=${cyEnv.CYPRESS_KEY} --parallel --headless --browser $CI_BROWSER --group $CI_GROUP --ci-build-id ${buildId}`
    : `npx cypress open --browser chrome --env ${cyEnv.runtime}`

  if (isCi) {
    // build with test env settings
    child.spawnSync(`cross-env ${sharedEnv} npm run build`, {
      shell: true,
      stdio: ['inherit', 'inherit', 'inherit'],
    })
    console.log('build stage complete', testStart)
    // serve & test
    const spawn = child.spawnSync(
      `npx concurrently ${serverStart} ${testStart}`,
      {
        shell: true,
        stdio: ['inherit', 'inherit', 'pipe'],
      },
    )
    if (spawn.status === 1) {
      process.exitCode = 1
    }
  }
  // // errors inherited by stdio above don't cause exit, so handle now
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
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}
