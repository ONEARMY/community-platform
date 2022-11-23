import type { InitialOptionsTsJest } from 'ts-jest/dist/types'
import { pathsToModuleNameMapper } from 'ts-jest/utils'

const config: InitialOptionsTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  // https://github.com/firebase/firebase-admin-node/issues/1488
  moduleNameMapper: pathsToModuleNameMapper({
    'firebase-admin/*': ['firebase-admin/lib/*'],
    'firebase-functions/*': ['firebase-functions/lib/*'],
  }),
  setupFiles: [
    '<rootDir>/scripts/set-up-environment-variables.ts',
    '<rootDir>/scripts/runtimeConfig/write.ts',
  ],
}

export default config
