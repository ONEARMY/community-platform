import type { JestConfigWithTsJest } from 'ts-jest'
import { pathsToModuleNameMapper } from 'ts-jest'

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  modulePathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/lib/'],

  testTimeout: 15000,
  moduleNameMapper: pathsToModuleNameMapper({
    // https://github.com/firebase/firebase-admin-node/issues/1488
    '@firebase/*': ['<rootDir>/node_modules/@firebase/*'],
    // fix issue where google-cloud/storage not picked up
    '@google-cloud/*': ['<rootDir>/node_modules/@google-cloud/*'],
  }),
  setupFiles: [
    '<rootDir>/scripts/set-up-environment-variables.ts',
    '<rootDir>/scripts/runtimeConfig/write.ts',
  ],
}

export default config
