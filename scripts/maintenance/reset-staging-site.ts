import { spawnSync, SpawnSyncOptions } from 'child_process'
import chalk from 'chalk'
import { generateDBEndpoints } from 'oa-shared'

/***********************************************************************************
 * Constants
 ************************************************************************************/
/** Gcloud/Firebase project to copy data from */
const SOURCE_PROJECT = 'onearmyworld'
/** Gcloud/Firebase project to copy data to */
const TARGET_PROJECT = 'onearmy-next'
/** Target project as referred to when using firebase cli (e.g. `firebase projects list`) */
const TARGET_PROJECT_ALIAS = 'next'
/** Intermediate storage bucket used to  */
const STORAGE_BUCKET = 'onearmyworld-exports'
/** Path to a service account file that will be used for operations */
const SERVICE_ACCOUNT_JSON_PATH = 'config/onearmy-migrator-service-account.json'
/** Timestamp suffix that will be appended to exports (e.g. 2021-01-26T0750) */
const timestamp = new Date().toISOString().substring(0, 16).replace(':','')
/** Storage path that will be used to store the exported data */
const EXPORT_TARGET = `${STORAGE_BUCKET}/${timestamp}`
// Specify collections and subcollections for export
// (can export all without setting collectionIds, but some data might be sensitive or not required. Also allows import into bigquery)
// e.g. 'v3_users','v3_events' and 'revisions' subcollection */

const DB_ENDPOINTS = generateDBEndpoints()
const COLLECTION_IDS = Object.values(DB_ENDPOINTS)
  .concat('revisions', 'stats')
  .join(',')

/**
 * WARNING - the following methods have the ability to entirely wipe data from projects,
 * so should not be used unless sure of what you are doing! (and you have the required permissions)
 *
 * This function will backup a firebase firestore database locally
 * https://cloud.google.com/firestore/docs/manage-data/move-data
 * 
 * It uses a combination of firebase scripts and gcloud scripts to achieve this
 *
 * Prerequisites
 * - gcloud installed locally
 * - gsutil running locally
 * - firebase cli installed locally
 * - service worker setup with following permissions:
 *      - read access to source project (basic viewer role)
 *      - admin access to storage bucket used (storage admin role)
 *      - admin access to target firebase datastore and functions
 * 
 * Recommendations
 * - disable write-access to source project (if want to ensure perfect clone)
 * 
 * Example execution
 * ```
   ts-node --project scripts/tsconfig.json scripts/maintenance/reset-staging-site.ts 
   ```
   Also available as a github action in the /.github/reset-staging-site.yml
 */
function main() {
  setupServiceAccount(SERVICE_ACCOUNT_JSON_PATH)
  exportFirestoreData(SOURCE_PROJECT, EXPORT_TARGET, COLLECTION_IDS)
  // Functions can contain firestore triggered functions, so remove to avoid triggering on data import/export
  deleteFirebaseFunctions(TARGET_PROJECT, TARGET_PROJECT_ALIAS)
  // Import operations merge data by default so need to first delete existing data
  wipeTargetFirestoreDB(TARGET_PROJECT_ALIAS)
  importFirestoreData(TARGET_PROJECT, EXPORT_TARGET, COLLECTION_IDS)
  redeployFirebaseFunctions(TARGET_PROJECT_ALIAS)

  /****************************** TODOs *******************************************
   * - export/import users - https://firebase.google.com/docs/cli/auth
   * - export/import storage (only required if planning to test storage deletion)
   * - export/import rtdb
   * - download exported file ()
   * - redeploy firebase functions when scripts fail or are interrupted
   *
   ********************************************************************************/

  // localhost reset cache button
}
main()

/** log into a pre-configured service account using credentials stored in local json file */
function setupServiceAccount(serviceAccountJsonPath: string) {
  // add credentials path to environment to allow firebase to proceed without login
  process.env.GOOGLE_APPLICATION_CREDENTIALS = serviceAccountJsonPath
  // authorise gcloud using same service account
  cli(
    `gcloud auth activate-service-account --key-file=${serviceAccountJsonPath}`,
  )
}

/** delete all functions (no native disable method) */
function deleteFirebaseFunctions(projectId: string, projectAlias: string) {
  cli(`gcloud config set project ${projectId}`)
  cli(`firebase use ${projectAlias}`)
  console.log(chalk.green(`[${projectId}] Disabling firebase functions`))
  // when calling the function list command pipe the result so it can be used here
  // firebase has no native function list method so use gcloud
  const res = cli(`gcloud functions list --format="json"`, 'pipe')
  const functionsJson = JSON.parse(String(res.stdout))
  const functionsList = functionsJson.map((v: any) => v.entryPoint).join(' ')
  if (functionsList.length > 0) {
    cli(`firebase functions:delete ${functionsList} --force`)
  }
}

/** forcefully deletes all collections and subcollections in the target project*/
function wipeTargetFirestoreDB(projectAlias: string) {
  cli(`firebase use ${projectAlias}`)
  console.log(chalk.green(`[Firebase Alias: ${projectAlias}] Wiping firestore`))
  cli(`firebase firestore:delete --all-collections --yes`)
}

/** Export specific collection list from firestore database to a storage object */
function exportFirestoreData(
  projectId: string,
  storagePath: string,
  collectionIds: string,
) {
  cli(`gcloud config set project ${projectId}`)
  console.log(chalk.green(`[${projectId}] Exporting to ${storagePath}`))
  cli(
    `gcloud firestore export gs://${storagePath} --collection-ids=${collectionIds}`,
  )
}

/** Import data from a previously exported storage path into a target project*/
function importFirestoreData(
  projectId: string,
  storagePath: string,
  collectionIds: string,
) {
  // ensure target project has access to export storage bucket
  const storageBucket = storagePath.split('/')[0]
  console.log(chalk.green(`[${projectId}] check access to [${storageBucket}]`))
  cli(
    `gsutil iam ch serviceAccount:${projectId}@appspot.gserviceaccount.com:admin gs://${storageBucket}`,
  )
  cli(`gcloud config set project ${projectId}`)
  // Documents are merged on import with any existing data, so need to first wipe
  console.log(chalk.green(`[${projectId}] Importing firestore data`))
  cli(
    `gcloud firestore import gs://${storagePath} --collection-ids=${collectionIds}`,
  )
}

/** call the firebase deploy method to deploy the target project functions */
function redeployFirebaseFunctions(projectAlias: string) {
  cli(`firebase use ${projectAlias}`)
  console.log(chalk.green(`Firebase [${projectAlias}] Deploying functions`))
  cli(`firebase deploy --only functions`)
}

/**
 * wrapper to call local commands on the cli
 * @param command - specify command to pass to the console
 * @param stdio - override default options.stdio if requiring
 * */
function cli(command: string, stdio?: SpawnSyncOptions['stdio']) {
  const child = spawnSync(command, {
    shell: true,
    // default behaviour will show stdin/stdout in the console but pipe
    // errors to allow local error handling
    //                stdin      stdout    stderror
    stdio: stdio || ['inherit', 'inherit', 'pipe'],
  })
  // many commands from gcloud and gsutil output information to stderr even if successful
  // so only exit with error code in some cases
  // https://github.com/GoogleCloudPlatform/gsutil/issues/526
  if (child.stderr) {
    const msg = String(child.stderr)
    if (msg.match(/error:|warning:/gi) || child.status === 1) {
      console.log(chalk.red(msg))
      process.exit(1)
    } else {
      // simply log informative messages from stderr
      console.log(msg)
    }
  }
  return child
}
