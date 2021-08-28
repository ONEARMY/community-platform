import * as fs from 'fs-extra'
import * as child from 'child_process'
import { PLATFORM_LIB_PATH, PLATFORM_ROOT_PATH, PLATFORM_TSCONFIG_TYPES_PATH } from './paths'


/**
 * In order to correctly bundle functions code with imports from the main platform src,
 * Run the typescript compiler on the src folder with a custom configuration to generate
 * type definitions for functions import.
 */
function precompile() {
    // Compile src folder typings so they can be imported locally
    fs.ensureDirSync(PLATFORM_LIB_PATH)
    fs.emptyDirSync(PLATFORM_LIB_PATH)
    console.log('Building src folder type definitions')
    // run typescript compilation for the main platform folder so types can be imported via webpack. Include force flag as tsc
    // will otherwise assume incremental compilation not required even though output folder has been wiped
    const cmd = `${PLATFORM_ROOT_PATH}/node_modules/.bin/tsc --build ${PLATFORM_TSCONFIG_TYPES_PATH} --force`
    console.log(cmd)
    child.spawnSync(cmd, { shell: true, stdio: ['inherit', 'inherit', 'inherit'] })
}
precompile()