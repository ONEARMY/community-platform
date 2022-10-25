import { writeFileSync } from 'fs'
import { resolve } from 'path'
import { FUNCTIONS_DIR } from '../paths'
import { runtimeConfigTest } from './model'

const runtimeConfigPath = resolve(FUNCTIONS_DIR, '.runtimeconfig.json')
writeFileSync(runtimeConfigPath, JSON.stringify(runtimeConfigTest))
