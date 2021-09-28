import * as fs from 'fs-extra'
import * as child from 'child_process'
import {
  OA_SHARED_ROOT_PATH,
  OA_SHARED_TSCONFIG_PATH,
  PLATFORM_LIB_PATH,
  PLATFORM_ROOT_PATH,
  PLATFORM_TSCONFIG_TYPES_PATH,
} from './paths'

/**
 * In order to correctly bundle functions code with imports from the main platform src,
 * Run the typescript compiler on the src folder with a custom configuration to generate
 * type definitions for functions import.
 */
function precompile() {
  // Compile src folder typings so they can be imported locally
  fs.ensureDirSync(PLATFORM_LIB_PATH)
  fs.emptyDirSync(PLATFORM_LIB_PATH)
  console.log('Compiling src and shared definitions')
  // run typescript compilation for the main platform folder so types can be imported via webpack. Include force flag as tsc
  // will otherwise assume incremental compilation not required even though output folder has been wiped
  spawnCommand(`${PLATFORM_ROOT_PATH}/node_modules/.bin/tsc --build ${PLATFORM_TSCONFIG_TYPES_PATH} --force`)
  // compile shared
  spawnCommand(`${OA_SHARED_ROOT_PATH}/node_modules/.bin/tsc --build ${OA_SHARED_TSCONFIG_PATH} --force`)
}
precompile()

function spawnCommand(cmd: string) {
  console.log(cmd)
  child.spawnSync(cmd, {
    shell: true,
    stdio: ['inherit', 'inherit', 'inherit'],
  })
}
