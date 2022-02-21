import { spawnSync } from 'child_process'
import Dockerode from 'dockerode'
import fs from 'fs-extra'
import path from 'path'
import {
  FIREBASE_JSON_EMULATORS_DEFAULT,
  OA_FIREBASE_IMAGE_NAME,
} from './common'
import { PATHS } from './paths'

const docker = new Dockerode()

async function build() {
  buildFunctions()
  populateDummyCredentials()
  copyAppFiles()
  updateFirebaseJson()

  const stream = await startDockerBuild()

  await followBuildProgress(stream)
}
async function startDockerBuild() {
  const stream = await docker.buildImage(
    {
      context: PATHS.workspaceDir,
      // Files listed here will be available to DOCKERFILE
      src: ['Dockerfile', 'app', 'credentials.json'],
    },
    { t: OA_FIREBASE_IMAGE_NAME },
  )
  return stream
}

/**
 * Docker image will include all current functions, so ensure compiled
 * Changes can be mapped with a volume
 * */
function buildFunctions() {
  spawnSync('yarn workspace functions build', {
    stdio: 'inherit',
    shell: true,
  })
}

/**
 * Firebase emulators still expect credentials in case they need to access production service in cases
 * where emulator not supported (e.g. some api discovery methods).
 * Provide dummy credentials so that emulators still work when calling emulated services
 * (production credentials could be mapped with volume if desirable)
 */
function populateDummyCredentials() {
  const credentialsPath = path.resolve(PATHS.workspaceDir, 'credentials.json')
  const dummyCredentials = {
    type: 'service_account',
    project_id: 'test',
    private_key_id: '',
    client_email: '',
    client_id: '',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url:
      'https://www.googleapis.com/robot/v1/metadata/x509/backend-functions-dev%40test.iam.gserviceaccount.com',
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
  fs.emptyDirSync(appFolder)
  // list of files to copy across.
  // Possible TODOs - copy only if changed, check firebase.json for rules
  const filenames = [
    'firebase.json',
    '.firebaserc',
    'firebase.storage.rules',
    'functions/package.json',
    'functions/dist',
  ]

  for (const filename of filenames) {
    const src = path.resolve(PATHS.rootDir, filename)
    if (fs.existsSync(src)) {
      const dest = path.resolve(PATHS.workspaceDir, 'app', filename)
      fs.copySync(src, dest)
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

/**
 * Docker builds are triggered in the background, so that the current scripts are unaware
 * of any progress updated and when completed/failed.
 * Add bindings to docker modem to track progress, proxy logs to main stdout, and resolve
 * as promise build completion/fail
 */
async function followBuildProgress(stream: NodeJS.ReadableStream) {
  await new Promise((resolve, reject) => {
    //   pipe logs, reformatting text which defaults to nested json
    docker.modem.followProgress(
      stream,
      (error, result) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      },
      onProgress => {
        const { stream, error, errorDetail } = onProgress || {}
        if (stream && typeof stream === 'string') {
          let output = stream
          // avoid duplicate line spacing caused by console logging text split
          // across multiple lines
          if (stream.endsWith('\n')) {
            output = stream.slice(0, -1)
          }
          console.log(output)
        }
        if (error) {
          console.error(error)
          if (errorDetail != error) {
            console.error(errorDetail)
          }
        }
      },
    )
  })
}

build()
