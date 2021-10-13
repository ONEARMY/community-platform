import { spawnSync } from "child_process"
import { SCRIPTS_DIR, PLATFORM_ROOT_PATH } from 'oa-shared/paths'
import path from 'path'

/** 
 * Prepare emulator seed data before running functions and platform servers in parallel 
 * NOTE - cannot call concurrently before seed data populated as requires user input
 * */
function startEmulated() {
    setEmulatorSeedData()
    startFunctionsAndPlatformServers()
}
startEmulated()

/** Call oa-script method to populate seed data */
function setEmulatorSeedData() {
    const cmd = `yarn workspace oa-scripts emulator:seed`
    spawnSync(cmd, { stdio: 'inherit', shell: true })
}

function startFunctionsAndPlatformServers() {
    const CONCURRENTLY_BIN = path.resolve(SCRIPTS_DIR, 'node_modules', '.bin', 'concurrently')
    const cmd = `${CONCURRENTLY_BIN} \"yarn workspace functions start\" \"cross-env PORT=4000 yarn start\"`
    spawnSync(cmd, { stdio: 'inherit', shell: true, cwd: PLATFORM_ROOT_PATH })
}
