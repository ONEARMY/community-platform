import { execSync, spawnSync } from 'child_process'
import chalk from 'chalk'
import fs from 'fs-extra'
import { runtimeConfigTest } from 'functions/scripts/runtimeConfig/model'
import { sync as globbySync } from 'globby'
import path from 'path'
import { FIREBASE_JSON_EMULATORS_DEFAULT } from './common'
import { PATHS } from './paths'

/**
 * Prepare all files required for build
 * Includes building functions workspace, copying to local folder, creating
 * dummy credentials for firebase auth and rewriting required mappings in firebase.json
 */
export async function prepare() {
  createSeedZips()
  ensureSeedData()
  prepareFunctionsBuild()
  buildFunctions()
  copyAppFiles()
  populateDummyCredentials()
  addRuntimeConfig()
  updateFirebaseJson()
  const buildArgs = generateBuildArgs()
  return buildArgs
}

/**
 * Ensure seed data from tar files has been extracted to working folder
 * NOTE - assumes tar executable exists on local machine
 */
function ensureSeedData() {
  const seedFiles = fs
    .readdirSync(PATHS.seedDataDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && path.extname(entry.name) === '.gz')
    .map((entry) => ({
      name: entry.name.replace('.tar.gz', ''),
      zipPath: path.resolve(PATHS.seedDataDir, entry.name),
    }))
  for (const seedFile of seedFiles) {
    const seedFolder = path.resolve(PATHS.seedDataDir, seedFile.name)
    if (!fs.existsSync(seedFolder)) {
      fs.mkdirSync(seedFolder)
      const cmd = `tar -xzvf "${seedFile.zipPath}" -C "${seedFolder}"`
      console.log(chalk.yellow(cmd))
      spawnSync(cmd, { stdio: 'inherit', shell: true })
    }
  }
}

/**
 * Functions expect index.html to be built from frontend folder for use in SEO render functions
 * Populate a placeholder if does not exist
 **/
function prepareFunctionsBuild() {
  const buildIndexHtmlPath = path.resolve(PATHS.rootDir, 'build', 'index.html')
  if (!fs.existsSync(buildIndexHtmlPath)) {
    fs.ensureFileSync(buildIndexHtmlPath)
    fs.writeFileSync(
      buildIndexHtmlPath,
      `<!DOCTYPE html><html lang="en"></html>`,
    )
  }
}

/**
 * Docker image will include all current functions, so ensure compiled
 * Changes can be mapped with a volume
 * */
function buildFunctions() {
  console.log(chalk.yellow('Building functions workspace...'))
  spawnSync('yarn workspace functions build', {
    stdio: 'inherit',
    shell: true,
  })
}

/**
 * Firebase emulators may still expect credentials in case they need to access production service in cases
 * where emulator not supported (e.g. some api discovery methods), with possible exception of projects starting 'demo-'.
 * Provide dummy credentials so that emulators still work when calling emulated services - must still pass checks so
 * fake credentials from: https://github.com/google/oauth2l/blob/master/integration/fixtures/fake-service-account.json
 * (production credentials could be mapped with volume if desirable)
 */
function populateDummyCredentials() {
  const credentialsPath = path.resolve(
    PATHS.workspaceDir,
    'app',
    'credentials.json',
  )
  const dummyCredentials = {
    type: 'service_account',
    project_id: 'community-platform-emulated',
    private_key_id: 'abc',
    private_key:
      '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDY3E8o1NEFcjMM\nHW/5ZfFJw29/8NEqpViNjQIx95Xx5KDtJ+nWn9+OW0uqsSqKlKGhAdAo+Q6bjx2c\nuXVsXTu7XrZUY5Kltvj94DvUa1wjNXs606r/RxWTJ58bfdC+gLLxBfGnB6CwK0YQ\nxnfpjNbkUfVVzO0MQD7UP0Hl5ZcY0Puvxd/yHuONQn/rIAieTHH1pqgW+zrH/y3c\n59IGThC9PPtugI9ea8RSnVj3PWz1bX2UkCDpy9IRh9LzJLaYYX9RUd7++dULUlat\nAaXBh1U6emUDzhrIsgApjDVtimOPbmQWmX1S60mqQikRpVYZ8u+NDD+LNw+/Eovn\nxCj2Y3z1AgMBAAECggEAWDBzoqO1IvVXjBA2lqId10T6hXmN3j1ifyH+aAqK+FVl\nGjyWjDj0xWQcJ9ync7bQ6fSeTeNGzP0M6kzDU1+w6FgyZqwdmXWI2VmEizRjwk+/\n/uLQUcL7I55Dxn7KUoZs/rZPmQDxmGLoue60Gg6z3yLzVcKiDc7cnhzhdBgDc8vd\nQorNAlqGPRnm3EqKQ6VQp6fyQmCAxrr45kspRXNLddat3AMsuqImDkqGKBmF3Q1y\nxWGe81LphUiRqvqbyUlh6cdSZ8pLBpc9m0c3qWPKs9paqBIvgUPlvOZMqec6x4S6\nChbdkkTRLnbsRr0Yg/nDeEPlkhRBhasXpxpMUBgPywKBgQDs2axNkFjbU94uXvd5\nznUhDVxPFBuxyUHtsJNqW4p/ujLNimGet5E/YthCnQeC2P3Ym7c3fiz68amM6hiA\nOnW7HYPZ+jKFnefpAtjyOOs46AkftEg07T9XjwWNPt8+8l0DYawPoJgbM5iE0L2O\nx8TU1Vs4mXc+ql9F90GzI0x3VwKBgQDqZOOqWw3hTnNT07Ixqnmd3dugV9S7eW6o\nU9OoUgJB4rYTpG+yFqNqbRT8bkx37iKBMEReppqonOqGm4wtuRR6LSLlgcIU9Iwx\nyfH12UWqVmFSHsgZFqM/cK3wGev38h1WBIOx3/djKn7BdlKVh8kWyx6uC8bmV+E6\nOoK0vJD6kwKBgHAySOnROBZlqzkiKW8c+uU2VATtzJSydrWm0J4wUPJifNBa/hVW\ndcqmAzXC9xznt5AVa3wxHBOfyKaE+ig8CSsjNyNZ3vbmr0X04FoV1m91k2TeXNod\njMTobkPThaNm4eLJMN2SQJuaHGTGERWC0l3T18t+/zrDMDCPiSLX1NAvAoGBAN1T\nVLJYdjvIMxf1bm59VYcepbK7HLHFkRq6xMJMZbtG0ryraZjUzYvB4q4VjHk2UDiC\nlhx13tXWDZH7MJtABzjyg+AI7XWSEQs2cBXACos0M4Myc6lU+eL+iA+OuoUOhmrh\nqmT8YYGu76/IBWUSqWuvcpHPpwl7871i4Ga/I3qnAoGBANNkKAcMoeAbJQK7a/Rn\nwPEJB+dPgNDIaboAsh1nZhVhN5cvdvCWuEYgOGCPQLYQF0zmTLcM+sVxOYgfy8mV\nfbNgPgsP5xmu6dw2COBKdtozw0HrWSRjACd1N4yGu75+wPCcX/gQarcjRcXXZeEa\nNtBLSfcqPULqD+h7br9lEJio\n-----END PRIVATE KEY-----\n',
    client_email: '123-abc@developer.gserviceaccount.com',
    client_id: '123-abc.apps.googleusercontent.com',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'http://localhost:8080/token',
    // token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url:
      'https://www.googleapis.com/robot/v1/metadata/x509/backend-functions-dev%40community-platform-emulated.iam.gserviceaccount.com',
  }
  fs.writeJsonSync(credentialsPath, dummyCredentials)
}

/**
 * Docker build cannot access files from outside context directory so
 * place temporary copy in local app folder that will be populated during build
 */
function copyAppFiles() {
  const appFolder = path.resolve(PATHS.workspaceDir, 'app')
  fs.ensureDirSync(appFolder)

  const functionsFiles = globbySync(['functions/dist'], {
    cwd: path.resolve(PATHS.rootDir),
  })

  /** Alternative glob pattern to match against src - requires refactor as described in readme known issues */
  // const functionsFiles = globbySync(['functions/'], {
  //   gitignore: true,
  //   cwd: path.resolve(PATHS.rootDir, 'functions'),
  //   ignore: ['data', 'node_modules', 'scripts'],
  // }).map(filename=>`functions/${filename}`)

  const additionalFiles = [
    'firebase.json',
    '.firebaserc',
    'firebase.storage.rules',
    'functions/package.json',
  ]
  const srcFiles = [...additionalFiles, ...functionsFiles]
  const targetFiles = globbySync(['**'], { cwd: appFolder })

  // Remove target files that no longer exist in source
  targetFiles.forEach((filename) => {
    if (!srcFiles.includes(filename)) {
      fs.removeSync(path.resolve(appFolder, filename))
    }
  })

  // Copy src files that do not exist in target or have been modified
  for (const filename of srcFiles) {
    const src = path.resolve(PATHS.rootDir, filename)
    if (fs.existsSync(src)) {
      const { mtime, atime } = fs.statSync(src)
      const dest = path.resolve(PATHS.workspaceDir, 'app', filename)
      // only copy if doesn't exist or changed. Retain timestamps for future comparison
      if (
        !fs.existsSync(dest) ||
        fs.statSync(dest).mtime.getTime() !== mtime.getTime()
      ) {
        fs.copySync(src, dest)
        fs.utimesSync(dest, atime, mtime)
      }
    }
  }
}

/** Update firebase json so that emulator ui host binds to docker */
function updateFirebaseJson() {
  const firebaseJsonPath = path.resolve(
    PATHS.workspaceDir,
    'app',
    'firebase.json',
  )
  const firebaseJson = fs.readJsonSync(firebaseJsonPath)
  firebaseJson.emulators = FIREBASE_JSON_EMULATORS_DEFAULT

  fs.writeFileSync(firebaseJsonPath, JSON.stringify(firebaseJson, null, 2))
}

/** Populate a runtime config file to set default firebase config variables for test */
function addRuntimeConfig() {
  const target = path.resolve(
    PATHS.workspaceDir,
    'app',
    'functions',
    '.runtimeconfig.json',
  )
  fs.writeFileSync(target, JSON.stringify(runtimeConfigTest, null, 2))
}

/**
 * Generate .tar.gz files for all data in import folder (as exported from firestore)
 * NOTE - whilst not used in default workflow still useful to have when testing locally
 * and can be run by replacing the prepare function with `createSeedZips()`
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function createSeedZips() {
  const seedFolders = fs
    .readdirSync(PATHS.seedDataDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({
      name: entry.name,
      zipPath: path.resolve(PATHS.seedDataDir, `${entry.name}.tar.gz`),
      folderPath: path.resolve(PATHS.seedDataDir, entry.name),
    }))
  for (const seedFolder of seedFolders) {
    if (!fs.existsSync(seedFolder.zipPath)) {
      const cmd = `tar -czvf "${seedFolder.zipPath}" -C ${seedFolder.folderPath} ."`
      console.log(chalk.yellow(cmd))
      spawnSync(cmd, { stdio: 'inherit', shell: true })
    }
  }
}

/** Create a list of args to pass into the Dockerfile build command */
function generateBuildArgs() {
  const buildArgs: Record<string, string> = {}
  const functionsPackageJsonPath = path.resolve(
    PATHS.functionsDistIndex,
    '../package.json',
  )
  // assign the docker firebase-tools version as same running in local functions workspace
  const functionsPackageJson = fs.readJsonSync(functionsPackageJsonPath)
  buildArgs.FIREBASE_TOOLS_VERSION =
    functionsPackageJson.dependencies['firebase-tools']
  // assign date and git commit sha ref
  buildArgs.BUILD_DATE = new Date().toISOString()
  buildArgs.VCS_REF = execSync('git rev-parse HEAD').toString().trim()
  // write args to file to read from dockerfile ci
  fs.writeFileSync(
    PATHS.buildArgsFile,
    Object.entries(buildArgs)
      .map(([k, v]) => `${k}=${v}`)
      .join('\n'),
  )
  console.table(buildArgs)
  return buildArgs
}

// Allow direct execution of file as well as import
if (require.main === module) {
  prepare()
}
