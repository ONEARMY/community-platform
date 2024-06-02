"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var PLATFORM_ROOT_DIR = path.resolve(__dirname, '../../../');
var WORKSPACE_DIR = path.resolve(__dirname, '../');
var SRC_DB_ENDPOINTS = path.resolve(PLATFORM_ROOT_DIR, 'src/stores/databaseV2/endpoints.ts');
var WORKSPACE_DB_ENDPOINTS = path.resolve(WORKSPACE_DIR, 'src/support/db/endpoints.ts');
var CY_BIN = path.resolve(WORKSPACE_DIR, 'node_modules/.bin/cypress');
var CROSSENV_BIN = path.resolve(WORKSPACE_DIR, 'node_modules/.bin/cross-env');
var BUILD_SERVE_JSON = path.resolve(PLATFORM_ROOT_DIR, 'build/serve.json');
exports.default = {
    WORKSPACE_DIR: WORKSPACE_DIR,
    PLATFORM_ROOT_DIR: PLATFORM_ROOT_DIR,
    SRC_DB_ENDPOINTS: SRC_DB_ENDPOINTS,
    WORKSPACE_DB_ENDPOINTS: WORKSPACE_DB_ENDPOINTS,
    CY_BIN: CY_BIN,
    CROSSENV_BIN: CROSSENV_BIN,
    BUILD_SERVE_JSON: BUILD_SERVE_JSON,
};
