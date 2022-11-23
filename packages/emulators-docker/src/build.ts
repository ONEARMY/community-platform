import Dockerode from 'dockerode'
import { IMAGE_NAME } from './common'
import { PATHS } from './paths'
import { prepare } from './prepare'

const docker = new Dockerode()

async function build() {
  const buildArgs = await prepare()
  const stream = await startDockerBuild(buildArgs)
  await followBuildProgress(stream)
}

/**
 * Initialise docker build
 * @param buildargs key-value pair of args to be passed into Dockerfile
 */
async function startDockerBuild(buildargs: Record<string, string>) {
  const stream = await docker.buildImage(
    {
      context: PATHS.workspaceDir,
      // Paths listed here will be available to dockerfile
      src: ['Dockerfile', 'app', 'seed_data', 'config'],
    },
    {
      t: IMAGE_NAME,
      buildargs,
    },
  )
  return stream
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
if (require.main === module) {
  build()
}
