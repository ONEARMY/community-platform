import Dockerode from 'dockerode'
import { getFirebasePortMapping } from './common'
import { PATHS } from './paths'

const docker = new Dockerode()

const CONTAINER_NAME = 'oa_firebase_emulator'
const IMAGE_NAME = 'oa-firebase-emulators:latest'

async function start() {
  let container: Dockerode.Container
  const allContainers = await docker.listContainers()
  const existingContainer = allContainers.find(c =>
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
    //
  } else {
    console.error('Failed to create container')
    process.exit(1)
  }

  //   docker.run('goatlab/firebase-emulator:latest',[],process.stdout)
}

/** Get latest container logs */
async function containerLogs(container: Dockerode.Container, tail?: number) {
  const logs: Buffer = (await container.logs({
    stderr: true,
    stdout: true,
    tail,
    follow: false, // return as string
  })) as any
  console.log('logs', logs.toString('utf8'))
}

async function inspectContainer(container: Dockerode.Container) {
  const data = await container.inspect()
  return data
}

function attachContainer(container: Dockerode.Container) {
  container.attach(
    { stream: true, stdout: true, stderr: true },
    (err, stream) => {
      stream.pipe(process.stdout)
    },
  )
}

async function createNewContainer() {
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
          AutoRemove: true, // TODO - remove once stable
          PortBindings,
          // Volumes - as node_modules installed locally and in container could be different os,
          // just bind compiled dist as a volume to allow any updates to be tracked
          Binds: [`${PATHS.functionsDistIndex}:/app/functions/dist/index.js`],
        },
      },
      function(err, container) {
        if (err) {
          reject(err)
        }
        resolve(container)
      },
    )
  })
}
function startContainer(container: Dockerode.Container) {
  container.start((err, data) => {
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
    .filter(port => port.expose)
    .reduce((prev, curr) => {
      const key = `${curr.port}/${curr.type}`
      prev[key] = {}
      return prev
    }, {} as any)
  const PortBindings = portMapping
    .filter(port => port.expose)
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

start()
