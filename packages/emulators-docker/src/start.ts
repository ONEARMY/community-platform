import Dockerode from 'dockerode'
import boxen from 'boxen'
import logUpdate from 'log-update'
import fs from 'fs-extra'
import {
  CONTAINER_NAME,
  getFirebasePortMapping,
  IMAGE_NAME,
  TAG_NAME,
} from './common'
import { PATHS } from './paths'

const docker = new Dockerode()

/** Attach to running container or create if does not exist */
async function start() {
  console.log('Container Start:', IMAGE_NAME)
  let container: Dockerode.Container
  const allContainers = await docker.listContainers()
  const existingContainer = allContainers.find((c) =>
    c.Names.includes(`/${CONTAINER_NAME}`),
  )
  if (existingContainer) {
    container = docker.getContainer(existingContainer.Id)
  } else {
    container = await createNewContainer()
  }

  if (container) {
    const { State } = await inspectContainer(container)
    if (State.Running) {
      await containerLogs(container)
      attachContainer(container)
    } else {
      attachContainer(container)
      startContainer(container)
    }
  } else {
    console.error('Failed to create container')
    process.exit(1)
  }
}

/** Get latest container logs */
async function containerLogs(container: Dockerode.Container, tail?: number) {
  const logs: Buffer = (await container.logs({
    stderr: true,
    stdout: true,
    tail,
    follow: false, // return as string
  })) as any
  console.log(logs.toString('utf8'))
}

async function inspectContainer(container: Dockerode.Container) {
  const data = await container.inspect()
  return data
}

/** Show log messages to indicate emulators ready for interaction and correct port */
async function handleEmulatorReady() {
  console.log(
    boxen(
      `
  🦾 Emulator Up and Running!
  ${TAG_NAME}
  
  Visit: http://localhost:4001 for dashboard  
    `,
      {
        borderColor: 'magenta',
        title: 'OneArmy Docker',
        titleAlignment: 'center',
      },
    ),
  )
}

function attachContainer(container: Dockerode.Container) {
  container.attach(
    { stream: true, stdout: true, stderr: true },
    (err, stream) => {
      stream.pipe(process.stdout)
      // HACK - determine when functions init complete via console logs
      stream.on('data', (data) => {
        const msg: string = data.toString()
        if (msg.includes('Issues? Report them at')) {
          handleEmulatorReady()
        }
      })
    },
  )
  // Handle ^C
  process.on('SIGINT', () => container.stop().then(() => process.exit(0)))
}

async function createNewContainer() {
  // ensure functions dist exists for binding
  if (!fs.existsSync(PATHS.functionsDistIndex)) {
    console.log('Waiting for functions to be built...')
    await _wait(5000)
    return createNewContainer()
  }

  const allImages = await docker.listImages()
  const existingImage = allImages.find((c) =>
    c.RepoTags.includes(`${IMAGE_NAME}`),
  )

  // pull remote image if required
  if (!existingImage) {
    await pullRemoteImage(IMAGE_NAME)
  }

  const { ExposedPorts, PortBindings } = rewritePortMapping()
  return new Promise<Dockerode.Container>((resolve, reject) => {
    docker.createContainer(
      {
        // Image: 'goatlab/firebase-emulator:latest',
        Image: IMAGE_NAME,
        name: CONTAINER_NAME,
        Tty: true,
        ExposedPorts,
        // Cmd: ['/bin/sh'], // uncomment to override default command to allow debugging on container
        HostConfig: {
          AutoRemove: true, // assume best to fully remove after use and provide clean environment each run
          PortBindings,
          // Bind Volumes
          // NOTE - as node_modules installed locally and in container could be different os,
          // just bind compiled dist as a volume to allow any updates to be tracked
          Binds: [`${PATHS.functionsDistIndex}:/app/functions/dist/index.js`],
        },
      },
      function (err, container) {
        if (err) {
          reject(err)
        }
        resolve(container)
      },
    )
  })
}
async function pullRemoteImage(imageName: string) {
  const updates: any = {}
  return new Promise((resolve, reject) => {
    docker.pull(imageName, {}, (err, stream) => {
      if (err) {
        handleImagePullFail(imageName)
        reject(err)
      }
      docker.modem.followProgress(
        stream,
        (finshedErr, finishedResult) => {
          logUpdate.done()
          if (finshedErr) reject(finshedErr)
          resolve(finishedResult)
        },
        (progress) => {
          // provide console log updates in a reasonable format
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id, progressDetail, ...update } = progress
          updates[id] = update
          logUpdate(
            ...Object.values<any>(updates).map((entry) =>
              JSON.stringify(entry, null, 2).replace(/[{}"]/g, ''),
            ),
          )
        },
      )
    })
  })
}
function startContainer(container: Dockerode.Container) {
  container.start((err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
  })
}

/**
 * Dockerode has a somewhat verbose method of defining ports (cf. -p 3000:3000)
 * Provide easier to syntax
 * Original source: https://github.com/the-concierge/concierge/blob/master/src/api/images/run.ts#L58
 * Linked issue: https://github.com/moby/moby/issues/23432#issuecomment-228842172
 **/
function rewritePortMapping() {
  const portMapping = getFirebasePortMapping()
  const ExposedPorts = portMapping
    .filter((port) => port.expose)
    .reduce((prev, curr) => {
      const key = `${curr.port}/${curr.type}`
      prev[key] = {}
      return prev
    }, {} as any)
  const PortBindings = portMapping
    .filter((port) => port.expose)
    .reduce((prev, curr) => {
      const key = `${curr.port}/${curr.type}`
      const hostCfg: any = {}

      // If a hostPort is specified, pass the option through to Docker
      if (curr.hostPort) {
        hostCfg.HostPort = curr.hostPort
      }
      prev[key] = [hostCfg]
      return prev
    }, {} as any)
  return { ExposedPorts, PortBindings }
}

function handleImagePullFail(imageName: string) {
  const baseName = imageName.split(':')[0]
  console.log(
    boxen(
      `🙁 Failed to pull image
${imageName}

See list of available images at: 
https://hub.docker.com/r/${baseName}/tags `,
      {
        borderColor: 'red',
        title: 'Error',
        titleAlignment: 'center',
        padding: 1,
      },
    ),
  )
}

/**
 * Execute an arbitrary command from within the container
 * NOTE - not currently used, previously included to trigger api endpoint after load.
 * Retaining for future ref
 * */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function execContainerCmd(container: Dockerode.Container, Cmd: string[]) {
  return container.exec(
    {
      Cmd,
      AttachStdin: true,
      AttachStderr: true,
      AttachStdout: true,
    },
    (err, exec) => {
      exec.start({ hijack: true, stdin: true }, (err, stream) => {
        docker.modem.demuxStream(stream, process.stdout, process.stderr)
      })
    },
  )
}

/** Wait an aribitrary number of milliseconds before continuing */
async function _wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

start()
