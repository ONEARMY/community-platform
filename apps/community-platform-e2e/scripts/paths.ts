import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PLATFORM_ROOT_DIR = resolve(__dirname, '../../../')
const WORKSPACE_DIR = resolve(__dirname, '../')

const SRC_DB_ENDPOINTS = resolve(
  PLATFORM_ROOT_DIR,
  'src/stores/databaseV2/endpoints.ts',
)
const WORKSPACE_DB_ENDPOINTS = resolve(
  WORKSPACE_DIR,
  'src/support/db/endpoints.ts',
)
const CY_BIN = resolve(WORKSPACE_DIR, 'node_modules/.bin/cypress')
const CROSSENV_BIN = resolve(WORKSPACE_DIR, 'node_modules/.bin/cross-env')
const BUILD_SERVE_JSON = resolve(PLATFORM_ROOT_DIR, 'build/serve.json')

export const PATHS = {
  WORKSPACE_DIR,
  PLATFORM_ROOT_DIR,
  SRC_DB_ENDPOINTS,
  WORKSPACE_DB_ENDPOINTS,
  CY_BIN,
  CROSSENV_BIN,
  BUILD_SERVE_JSON,
}
