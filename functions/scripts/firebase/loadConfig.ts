import { spawnSync } from 'child_process'
import fs from 'fs-extra'
import path from 'path'
import os from 'os'
import { FUNCTIONS_DIR } from 'oa-shared/paths'

const RUNTIME_CONFIG_PATH = path.resolve(FUNCTIONS_DIR, '.runtimeconfig.json')

/**
 * Copy firebase server config environment to use when running firebase serve locally
 * NOTE - While this can be achieved as a oneliner (e.g. firebase functions:config:get > .runtimeconfig.json),
 * Linux/Windows incompatibilities makes it easier to just keep as script *
 */
export function loadFirebaseConfig() {
  const cmd = 'firebase functions:config:get'
  const output = spawnSync(cmd, {
    stdio: ['inherit', 'pipe', 'inherit'],
    shell: true,
  })
  if (output.status === 1) {
    console.error(output.stdout.toString())
    console.error('You must be a member of the community-platform firebase project and logged in to run local config')
    process.exit(1)
  }
  const config = JSON.parse(output.stdout.toString())
  fs.writeJSONSync(RUNTIME_CONFIG_PATH, config, { spaces: 2, EOL: os.EOL })
  console.log('[Firebase Config] - loaded')
  return RUNTIME_CONFIG_PATH
}
