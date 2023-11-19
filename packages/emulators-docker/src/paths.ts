import path from 'path'

const workspaceDir = path.resolve(__dirname, '../')

const rootDir = path.resolve(workspaceDir, '../../')

const firebaseJson = path.resolve(rootDir, 'firebase.json')

const dockerFile = path.resolve(workspaceDir, 'Dockerfile')

const seedDataDir = path.resolve(workspaceDir, 'seed_data')

const buildArgsFile = path.resolve(workspaceDir, 'build.args')

const functionsDir = path.resolve(rootDir, 'functions')

export const PATHS = {
  workspaceDir,
  rootDir,
  firebaseJson,
  dockerFile,
  functionsDir,
  seedDataDir,
  buildArgsFile,
}
