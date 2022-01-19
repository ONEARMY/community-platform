import * as path from 'path'

const PLATFORM_ROOT_DIR = path.resolve(__dirname, '../../../')
const WORKSPACE_DIR = path.resolve(__dirname, '../')

const SRC_DB_ENDPOINTS = path.resolve(PLATFORM_ROOT_DIR, 'src/stores/databaseV2/endpoints.ts')
const WORKSPACE_DB_ENDPOINTS = path.resolve(WORKSPACE_DIR, 'src/support/db/endpoints.ts')
const CY_BIN = path.resolve(WORKSPACE_DIR, 'node_modules/.bin/cypress')
const CROSSENV_BIN = path.resolve(WORKSPACE_DIR, 'node_modules/.bin/cross-env')
const BUILD_SERVE_JSON = path.resolve(PLATFORM_ROOT_DIR, 'build/serve.json')

export default {
    WORKSPACE_DIR,
    PLATFORM_ROOT_DIR,
    SRC_DB_ENDPOINTS,
    WORKSPACE_DB_ENDPOINTS,
    CY_BIN,
    CROSSENV_BIN,
    BUILD_SERVE_JSON,
}