import * as path from 'path'

const WORKSPACE_DIR = path.resolve(__dirname, '../')
const PLATFORM_ROOT_DIR = path.resolve(WORKSPACE_DIR, '..')
const SRC_DB_ENDPOINTS = path.resolve(PLATFORM_ROOT_DIR, 'src/stores/databaseV2/endpoints.ts')
const WORKSPACE_DB_ENDPOINTS = path.resolve(WORKSPACE_DIR, 'src/support/db/endpoints.ts')
const CY_BIN_PATH = path.resolve(WORKSPACE_DIR, 'node_modules/.bin/cypress')
const CROSSENV_BIN_PATH = path.resolve(WORKSPACE_DIR, 'node_modules/.bin/cross-env')

export default {
    WORKSPACE_DIR,
    PLATFORM_ROOT_DIR,
    SRC_DB_ENDPOINTS,
    WORKSPACE_DB_ENDPOINTS,
    CY_BIN_PATH,
    CROSSENV_BIN_PATH
}