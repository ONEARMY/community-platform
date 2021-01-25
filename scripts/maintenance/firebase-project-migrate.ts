import { spawnSync } from 'child_process'
import chalk from 'chalk'

const SOURCE_PROJECT = 'onearmyworld'
const TARGET_PROJECT = 'onearmy-next'
const TARGET_PROJECT_ALIAS = 'next'
const STORAGE_BUCKET = 'onearmyworld-exports'
const timestamp = new Date().toISOString().substring(0, 16)
const EXPORT_TARGET = `${STORAGE_BUCKET}/${timestamp}`
const DB_PREFIX = 'v3'
/** e.g. 'v3_users','v3_events' and 'revisions' subcollection */
const COLLECTION_IDS = ['events', 'howtos', 'mappins', 'tags', 'users']
  .map(id => `${DB_PREFIX}_${id}`)
  .concat('revisions')
  .join(',')

/**
 * WARNING - the following methods have the ability to entirely wipe data from projects,
 * so should not be used unless sure of what you are doing! (and you have the required permissions)
 *
 * This function will backup a firebase firestore database locally
 * https://cloud.google.com/firestore/docs/manage-data/move-data
 *
 * Prerequisites
 * - gcloud installed locally
 * - gsutil running locally
 * - firebase cli installed locally
 */
function main() {
  wipeTargetFirestoreDB(TARGET_PROJECT_ALIAS)
  exportFirestoreData(SOURCE_PROJECT, EXPORT_TARGET, COLLECTION_IDS)
  importFirestoreData(TARGET_PROJECT, EXPORT_TARGET, COLLECTION_IDS)

  // TODO
  // export/import users
  // export/import storage
  // export/import rtdb
  // dl locally

  // export source firestore
  // copy storage bucket objects (-m parallel, -r recursive)
  // gsutil -m cp -r gs://<bucket-myapp-name> gs://<bucket-myapp-dev-name>
}
main()

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

// import
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

/**
 * Delete all collections in a target firebase project
 */
function wipeTargetFirestoreDB(targetProjectAlias: string) {
  cli(`firebase use ${targetProjectAlias}`)
  console.log(
    chalk.green(
      `[Firebase Alias: ${targetProjectAlias}] Wiping firestore data`,
    ),
  )
  cli(`firebase firestore:delete --all-collections`)
}

/** wrapper to call local commands */
function cli(command: string) {
  const child = spawnSync(command, {
    shell: true,
    stdio: ['inherit', 'inherit', 'pipe'],
  })
  // many commands from gcloud and gsutil output information to stderr even if successful
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
}
