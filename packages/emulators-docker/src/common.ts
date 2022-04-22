const { repo, tag } = extractArgs()
export const REPOSITORY = repo ? `${repo}/` : ''
export const CONTAINER_NAME = 'oa_firebase_emulator'
const TAG = tag
export const IMAGE_NAME = `${REPOSITORY}${CONTAINER_NAME}:${TAG}`

interface IDockerPortMapping {
  expose?: boolean
  port: number
  type: string
  hostPort: string
}

/** Convert emulators port to mapping supported by dockerode */
export function getFirebasePortMapping() {
  const portMapping: IDockerPortMapping[] = Object.values<{ port: number }>(
    FIREBASE_JSON_EMULATORS_DEFAULT,
  ).map(({ port }) => {
    return { port, expose: true, hostPort: `${port}`, type: 'tcp' }
  })
  return portMapping
}

/** Default configuration to provide to firebase.json for mapping emulators within docker */
export const FIREBASE_JSON_EMULATORS_DEFAULT = {
  ui: {
    enabled: true,
    port: 4001,
    host: '0.0.0.0',
  },
  functions: {
    port: 4002,
    host: '0.0.0.0',
  },
  firestore: {
    port: 4003,
    host: '0.0.0.0',
  },
  auth: {
    port: 4005,
    host: '0.0.0.0',
  },
  database: {
    port: 4006,
  },
  storage: {
    port: 4007,
    host: '0.0.0.0',
  },
}

/** Minimal method to extract optional repo and tag args */
function extractArgs() {
  const args = { repo: null, tag: 'latest' }
  process.argv.slice(2).forEach((arg) => {
    const [selector, value] = arg
      .split('=')
      .map((v) => v.trim().replace('--', ''))
    if (args.hasOwnProperty(selector)) {
      args[selector] = value
    } else {
      console.warn('Arg not recognised', selector)
    }
  })
  return args
}
