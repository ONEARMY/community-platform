#!/usr/bin/env ts-node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var dotenv_1 = require("dotenv");
var fs_extra_1 = require("fs-extra");
var wait_on_1 = require("wait-on");
var TestUtils_1 = require("../src/utils/TestUtils");
var paths_1 = require("./paths");
var e2eEnv = (0, dotenv_1.config)();
var isCi = process.argv.includes('ci');
var isProduction = process.argv.includes('prod');
// Prevent unhandled errors being silently ignored
process.on('unhandledRejection', function (err) {
    console.error('There was an uncaught error', err);
    process.exitCode = 1;
});
/**
 * When running e2e tests with cypress we need to first get the server up and running
 * before launching the test suite. We will seed the DB from within the test suite
 *
 * @argument ci - specify if running in ci (e.g. circleci) to run and record
 * @argument prod - specify to use a production build instead of local development server
 * @example npm run test ci prod
 *
 * TODO: CC - 2021-02-24
 * - DB seeding happens inbetween test suites, but really should happen before/after test
 * scripts start and end (particularly teardown, as it won't be called if tests fail).
 * Possibly could be done with a Cypress.task or similar
 * Temp cli function to wipe hanging db: `firebase use ci; firebase firestore:delete --all-collections`
 */
main()
    .then(function () { return process.exit(0); })
    .catch(function (err) {
    console.error(err);
    process.exit(1);
});
function main() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // copy endpoints for use in testing
                    fs_extra_1.default.copyFileSync(paths_1.default.SRC_DB_ENDPOINTS, paths_1.default.WORKSPACE_DB_ENDPOINTS);
                    return [4 /*yield*/, startAppServer()];
                case 1:
                    _a.sent();
                    runTests();
                    return [2 /*return*/];
            }
        });
    });
}
/** We need to ensure the platform is up and running before starting tests
 * There are npm packages like start-server-and-test but they seem to have flaky
 * performance in some environments (https://github.com/bahmutov/start-server-and-test/issues/250).
 * Instead manually track via child spawns
 *
 */
function startAppServer() {
    return __awaiter(this, void 0, void 0, function () {
        var CROSSENV_BIN, BUILD_SERVE_JSON, crossEnvArgs, serverCmd, opts, child, timeout;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    CROSSENV_BIN = paths_1.default.CROSSENV_BIN, BUILD_SERVE_JSON = paths_1.default.BUILD_SERVE_JSON;
                    crossEnvArgs = "FORCE_COLOR=1 REACT_APP_SITE_VARIANT=test-ci";
                    serverCmd = "".concat(CROSSENV_BIN, " ").concat(crossEnvArgs, " BROWSER=none PORT=3456 yarn start");
                    // for production will instead serve from production build folder
                    if (isProduction) {
                        // create local build if not running on ci (which will have build already generated)
                        if (!isCi) {
                            // specify CI=false to prevent throwing lint warnings as errors
                            (0, child_process_1.spawnSync)("".concat(CROSSENV_BIN, " ").concat(crossEnvArgs, " CI=false yarn build"), {
                                shell: true,
                                stdio: ['inherit', 'inherit', 'pipe'],
                            });
                        }
                        opts = { rewrites: [{ source: '/**', destination: '/index.html' }] };
                        fs_extra_1.default.writeFileSync(BUILD_SERVE_JSON, JSON.stringify(opts));
                        serverCmd = "npx serve build -l 3456";
                    }
                    child = (0, child_process_1.spawn)(serverCmd, {
                        shell: true,
                        stdio: ['pipe', 'pipe', 'inherit'],
                        cwd: paths_1.default.PLATFORM_ROOT_DIR,
                    });
                    child.stdout.on('data', function (d) {
                        var msg = d.toString('utf8');
                        console.log(msg);
                        // throw typescript build errors
                        if (msg.includes('Failed to compile')) {
                            // the server will still be running after compile failure (waiting for changes),
                            // so give time for any other messages to come through before exiting manually
                            setTimeout(function () {
                                process.exit(1);
                            }, 2000);
                        }
                    });
                    timeout = 5 * 60 * 1000;
                    return [4 /*yield*/, (0, wait_on_1.default)({ resources: ['http-get://127.0.0.1:3000'], timeout: timeout })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function runTests() {
    console.log(isCi ? 'Start tests' : 'Opening cypress for manual testing');
    var e = process.env;
    var CYPRESS_KEY = e2eEnv.parsed.CYPRESS_KEY;
    var CI_BROWSER = e.CI_BROWSER || 'chrome';
    var CI_GROUP = e.CI_GROUP || '1x-chrome';
    // not currently used, but can pass variables accessed by Cypress.env()
    var CYPRESS_ENV = "DUMMY_VAR=1";
    // use workflow ID so that jobs running in parallel can be assigned to same cypress build
    // cypress will use this to split tests between parallel runs
    var buildId = e.CIRCLE_WORKFLOW_ID || (0, TestUtils_1.generateAlphaNumeric)(8);
    // main testing command, depending on whether running on ci machine or interactive local
    // call with path to bin as to ensure locally installed used
    var CY_BIN = paths_1.default.CY_BIN, CROSSENV_BIN = paths_1.default.CROSSENV_BIN;
    var testCMD = isCi
        ? "".concat(CY_BIN, " run --record --env ").concat(CYPRESS_ENV, " --key=").concat(CYPRESS_KEY, " --parallel --headless --browser ").concat(CI_BROWSER, " --group ").concat(CI_GROUP, " --ci-build-id ").concat(buildId)
        : "".concat(CY_BIN, " open --browser chrome --env ").concat(CYPRESS_ENV);
    console.log("Running cypress with cmd: ".concat(testCMD));
    var spawn = (0, child_process_1.spawnSync)("".concat(CROSSENV_BIN, " FORCE_COLOR=1 ").concat(testCMD), {
        shell: true,
        stdio: ['inherit', 'inherit', 'pipe'],
        cwd: paths_1.default.WORKSPACE_DIR,
    });
    console.log('testing complete with exit code', spawn.status);
    if (spawn.status === 1) {
        console.error('error', spawn.stderr.toString());
    }
    process.exit(spawn.status);
}
