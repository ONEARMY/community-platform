import path from 'path'

const workspaceDir = path.resolve(__dirname, '../')

const rootDir = path.resolve(workspaceDir, '../../')

const firebaseJson = path.resolve(rootDir, 'firebase.json')

const dockerFile = path.resolve(workspaceDir, 'DOCKERFILE')

const functionsDistIndex = path.resolve(
  rootDir,
  'functions',
  'dist',
  'index.js',
)

export const PATHS = {
  workspaceDir,
  rootDir,
  firebaseJson,
  dockerFile,
  functionsDistIndex,
}
