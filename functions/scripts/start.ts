import { spawn } from 'child_process'
import * as path from 'path'
import webpack from 'webpack'
import * as os from 'os'
import * as fs from 'fs-extra'
import webpackConfig from '../webpack.config'
import {
  EMULATOR_EXPORT_FOLDER,
  EMULATOR_IMPORT_FOLDER,
  EMULATOR_IMPORT_PATH,
} from './paths'
import { emulatorSeed } from './emulator/seed'

/**
 * Start the functions emulator and functions source code in parallel
 *
 * NOTE - whilst similar functionality can be achieved with packages like 'concurrently',
 * SIGTERM signals don't seem to always be handled correctly and the emulator doesn't complete
 * export operations. Similarly webpack watch cli respawns even after SIGINT so better to run programatically
 */
function main() {
  // CLI: concurrently --kill-others-on-fail --names \"emulator,functions\" -c \"blue,magenta\" \"yarn serve:emulated\" \"yarn watch\"

  compileAndWatchFunctions()
    .then(webpackWatcher => {
      if (webpackWatcher) {
        // start emulator only after compiler running (to pass close callback)
        startEmulator(webpackWatcher)
      }
    })
    .catch(err => {
      console.error(err)
      process.exit(1)
    })
}
main()

/** Programatically run webpack in watch mode */
async function compileAndWatchFunctions(): Promise<webpack.Compiler.Watching> {
  // CLI: webpack --watch
  const compiler = webpack(webpackConfig)
  // Start a build in watch mode
  const watcher = compiler.watch(
    {
      aggregateTimeout: 300,
      poll: undefined,
    },
    (err, stats) => {
      if (stats.hasErrors()) {
        const info = stats.toJson()
        console.log('[Compile Error]', info.errors)
        process.exit(1)
      }
      if (err) {
        console.log('[Compiler Error]', err)
      }
    },
  )
  // Wait for the first build to be completed before resolving (to ensure dist folder populated)
  return new Promise(resolve => {
    compiler.hooks.afterCompile.tap('build complete', () => {
      resolve(watcher)
    })
  })
}

/**
 * Spawn a shell to run the firebase emulators from
 * Includes a custom environment configuration to enable full access to api methods which are otherwise limited
 * to non-authenticated users. It achieves this by having 2 sets of credentials:
 *
 * 1) A genuine (read-only) service account that authenticates with google servers
 * 2) A fake project specified to run the emulator against
 *
 * The reason we need both is because google expects authenticated users to access various 3rd party apis before
 * code execution, e.g. https://github.com/firebase/firebase-tools/issues/1683 and https://github.com/firebase/firebase-tools/issues/1708
 */
function startEmulator(functionsCompiler: webpack.Compiler.Watching) {
  // call firebase bin directly in case not installed globally
  const FIREBASE_BIN = path.resolve(__dirname, '../node_modules/.bin/firebase')
  // the name of the project that generated service account credentials has access to
  const REAL_PROJECT_ID = 'precious-plastics-v4-dev'
  // any project id can be specified (doesn't have to be real) - functions will be available on the endpoint
  const EMULATOR_PROJECT_ID = 'emulator-demo'
  let cmd = `${FIREBASE_BIN} use ${REAL_PROJECT_ID} && ${FIREBASE_BIN} --project=${EMULATOR_PROJECT_ID} emulators:start`

  // ensure seed data imported
  checkSeedData()
  cmd = `${cmd} --import=${EMULATOR_IMPORT_FOLDER}`

  // change this value if also wanting to export data
  if (false) {
    cmd = `${cmd} --export-on-exit=${EMULATOR_EXPORT_FOLDER}`
  }

  const env = {
    GCLOUD_PROJECT: EMULATOR_PROJECT_ID,
    GOOGLE_APPLICATION_CREDENTIALS: prepareGoogleApplicationCredentials(),
  }

  const child = spawn(cmd, {
    shell: true,
    stdio: ['inherit', 'inherit', 'inherit'],
    env,
  })
  // listen for close and kill functions compiler if error thrown
  child.on('close', code => {
    if (code === 1) {
      console.error('[Emulator Error]')
      functionsCompiler.close(() =>
        console.log('Functions compiler terminated'),
      )
    }
  })
}

function checkSeedData() {
  // TODO - handle case where seed data exists but newer data available (e.g. specify file)
  if (!fs.existsSync(EMULATOR_IMPORT_PATH)) {
    console.log('[Emulator] - Seeding Data')
    emulatorSeed()
  }
}

/**
 * Generate a custom service-account file for use with GOOGLE_APPLICATION_CREDENTIALS application login.
 * @returns path to generated json file
 *
 * Note - whilst it is insecure to publish service account details in an open-source repo,
 * the limited priviledges available to the demo project service account encrypted below are
 * considered safe enough for sharing
 */
function prepareGoogleApplicationCredentials() {
  const serviceAccountPath = path.resolve(
    os.tmpdir(),
    'firebase-functions-emulator.json',
  )
  const READ_ONLY_SERVICE_ACCOUNT_B64 = `ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3VudCIsCiAgInByb2plY3RfaWQiOiAicHJlY2lvdXMtcGxhc3RpY3MtdjQtZGV2IiwKICAicHJpdmF0ZV9rZXlfaWQiOiAiOTY5N2MyOWJjNmE3NWM2MmUzOGYzMzJiNTA3YTIwMDJjZTkxODk4ZCIsCiAgInByaXZhdGVfa2V5IjogIi0tLS0tQkVHSU4gUFJJVkFURSBLRVktLS0tLVxuTUlJRXZnSUJBREFOQmdrcWhraUc5dzBCQVFFRkFBU0NCS2d3Z2dTa0FnRUFBb0lCQVFDemZuOHlOWFJYZUcwM1xueXRnYzJsQzZtZ3o5WWhUZDNVNytnU3ZEc2t3aUl0YVZ2OU1oRXVpSFRLWHlZditCMGVCWTRkV0pSZjNPUW9wSVxuS2V3ZGdlVUw1YlhkVm5NZDkzTVlpVGVrY1RzMk5xTU5CeW5VZlpvemdXMVU1Ym1tS0lhT2dvbkNBUW1Nd01TZVxuNHZPQS9FaXFxdGppRG83TzNKT2VOOWFtS2hadUhwWVd2bHdmNU1MVmw3dTkzR2ZCdFpmZ0RlVmFpR2RkTU1PbVxuRit5SWJCNlFSbC9sNjhJaWt5UmtNSmcwRmtQOWhBb1NMK240aHZSYlMzSkFmMlpMcFJKZUFPaW9LbnJ6R3dLVFxuQ0NkZUZhcDBFNFpkNVppbmNDMXkyVFF6M3J4ZXFudGxvOXlFUWRvTE9Kbm5lN05DS3draS9xYnV4NWZaUFh3ZFxucXQ3T3BRYUpBZ01CQUFFQ2dnRUFCdEcvSDU5V0I1WTIwUXd5OUhxclgwR0h6WThldzVTYlFoSlNnVFY2akwvMVxuMXR2aU43TVdGRURhVzZoODlGZk96aFdyWlJNY2lzdnVvTUg5KzF1Q1loYTB0Mzluc1h0am15cW9hMllWWmJDQ1xuOXBWZmRwZ2NoZ2tzYUJHdndWTXdGSVU3V2x4cmVsWmZDZm5ObmtpSGNydDVzTEgwcFVHT1ZyQWdwckM1NkM1UFxuSlE2VzhLZHMvcVhQeXRmMktvWHhhR2ExaGFWNGd3ZHo1bStXVWcrNTFZdFVFbEg0V0ROSkQvV3RiVUJodUNpRVxuWlhzZGNrVWVuT0xjTUJ5V0RldEVYVi9OaHRzK2t2RCtvNFMvd3N2UHZySWZpRGtGQTVzNUQzMVh0NDczeG9GQVxuUkxmZ0hIVWtTMDFDWjlSdFJpS1I2SThjTlFidVRJYjcyWVlqbXN5dnNRS0JnUUR5Rmc5cGg0Z24zbkUxL3Jib1xuN1Z0K2RnYlJzdDErWEtWeUdRQjJ0ejRibFYrYnZuY3daTXBIZGhNc3hDSnlkVllibDlNeGZXbkhqRTI0U0I4YVxuUUxUcU1QTXhqVTNHWURwOVVHL2ZZR296TmVxalZaNjJwNVFoTDhOZ2o4bktpUzBBalpqeGJIYWN2dGtCMU42T1xuWjIraEhhb0ZyM2tBOTZrbU0xamhkaEJZbVFLQmdRQzl6M3pDdkJxdlNqSFRXQisvNDExaU5oc3ZiaVNBQURuL1xuZ0pNMlF1UFFpK3VNVW9mNHlNK3BFcGNRSzFyaHo3Y2ZINGtiTWt6aGk5NGRtaXNMK1lkeW81di9aT25ZNmIvMVxuUTYrYXlzRmYwMXdoVjVHWDE5QmNiOThyNFdTTjgxc0lzZlhJQ1hBWHI2bXd3K0wxWDJHYXhlMzBBMk92UkF4cFxuZ0VRc1hYa2pjUUtCZ1FEaUdreUd5YmtYVTZEMVIxTmF0ZVhRZFRmbFAyTzBFNS9Lc3lORnZkdmFNMmM2dFdmb1xuNFJvMEtFbThjK3VnYjRyZTlxeWYrbnlEamIxQk1zc3AzK21aR2VMcUV3bmpFQmxRMVlISFpldUtyUDdiVXFxTFxuK25SVmtxQ3VYVjJoTndHN0ZJVVdaN0ZZc0w5S0FLRms2NkxOSGtHZ1VjVjRhOWVtQUNzeFdPM25jUUtCZ1FDclxucUNxM1hqQnYySlNwQXFoci9HNW10SEh2ZWhldVh3WVVxSzM1dzVLTjl3eEY4aG1nQjlPdG51OVpJeXhrelZwWlxuM2tZN2Ywa0NMV0RwdXBRMWx5eEVvK3dmazU3Y21jRU5TWEpWZGdwZDVDTU0wRW9PWFpIRkZ6Tm9Wc1YranRnRVxuVEJUd0hJRHdHdUJHeVZESEFjU2VtV1B5YXVKTERpcC9ldzJzWmJoNU1RS0JnQ1ZROU9qaTJNb2xtQ0M2bTYzeFxuYXMxMnIxdjJhV3FzbHVlTHRvNHV4NEh4ZEkxN0JQU3RsWjdIKy95Z0hXdmxDUWNJTU5TWkRpSFpBVWh0Mzg1aVxubmp0WFYxVkxZR05sNEIyRXJabU82VUhMTzAySndOMUw0M1d4bm5yY3ZlMFp4ZnJ5bEpkUVpTTElUaWFraGVpRlxuN0piK2FxNCtkTVdDYk1yVnp4WGozb29KXG4tLS0tLUVORCBQUklWQVRFIEtFWS0tLS0tXG4iLAogICJjbGllbnRfZW1haWwiOiAiYmFja2VuZC1mdW5jdGlvbnMtZGV2QHByZWNpb3VzLXBsYXN0aWNzLXY0LWRldi5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsCiAgImNsaWVudF9pZCI6ICIxMTA1OTEyOTQyODk1MDE1NzI4NTEiLAogICJhdXRoX3VyaSI6ICJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20vby9vYXV0aDIvYXV0aCIsCiAgInRva2VuX3VyaSI6ICJodHRwczovL29hdXRoMi5nb29nbGVhcGlzLmNvbS90b2tlbiIsCiAgImF1dGhfcHJvdmlkZXJfeDUwOV9jZXJ0X3VybCI6ICJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9vYXV0aDIvdjEvY2VydHMiLAogICJjbGllbnRfeDUwOV9jZXJ0X3VybCI6ICJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9yb2JvdC92MS9tZXRhZGF0YS94NTA5L2JhY2tlbmQtZnVuY3Rpb25zLWRldiU0MHByZWNpb3VzLXBsYXN0aWNzLXY0LWRldi5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIKfQ==`
  const buffer = Buffer.from(READ_ONLY_SERVICE_ACCOUNT_B64, 'base64')
  const serviceAccountTxt = buffer.toString('utf8')
  fs.writeFileSync(serviceAccountPath, serviceAccountTxt)
  // add script to delete generated file on process exit
  process.on('SIGINT', () => {
    fs.removeSync(serviceAccountPath)
    process.exit(0)
  })
  return serviceAccountPath
}
