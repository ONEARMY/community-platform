import { spawnSync } from 'child_process'
import chalk from 'chalk'
import Dockerode from 'dockerode'
import fs from 'fs-extra'
import { sync as globbySync } from 'globby'
import path from 'path'
import {
  FIREBASE_JSON_EMULATORS_DEFAULT,
  OA_FIREBASE_IMAGE_NAME,
} from './common'
import { PATHS } from './paths'

const docker = new Dockerode()

async function build() {
  buildFunctions()
  copyAppFiles()
  populateDummyCredentials()
  updateFirebaseJson()

  const stream = await startDockerBuild()

  await followBuildProgress(stream)
}
async function startDockerBuild() {
  const stream = await docker.buildImage(
    {
      context: PATHS.workspaceDir,
      // Paths listed here will be available to DOCKERFILE
      src: ['Dockerfile', 'app', 'import', 'config'],
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
    project_id: 'demo-community-platform',
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
      'https://www.googleapis.com/robot/v1/metadata/x509/backend-functions-dev%40demo-community-platform.iam.gserviceaccount.com',
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

  const functionsFiles = []

  /** Alternative glob pattern to match against src - requires refactor as described in readme known issues */
  // const functionsFiles = globbySync(['**'], {
  //   gitignore: true,
  //   cwd: path.resolve(PATHS.workspaceDir, 'functions'),
  //   ignore: ['data', 'node_modules', 'scripts'],
  // })

  const additionalFiles = [
    'firebase.json',
    '.firebaserc',
    'firebase.storage.rules',
    'functions/package.json',
    'functions/dist',
  ]
  const srcFiles = additionalFiles.concat(
    functionsFiles.map((filename) => `functions/${filename}`),
  )
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
      (onProgress) => {
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
