export const OA_FIREBASE_IMAGE_NAME = 'oa-firebase-emulators'

interface IDockerPortMapping {
  expose?: boolean
  port: number
  type: string
  hostPort: string
}

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
    __note__:
      'host bindings do not appear to work for database (https://github.com/firebase/firebase-tools/issues/2633)',
  },
  storage: {
    port: 4007,
    host: '0.0.0.0',
  },
}
