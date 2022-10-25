import type { InitialOptionsTsJest } from 'ts-jest/dist/types'

const config: InitialOptionsTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  setupFiles: [
    '<rootDir>/scripts/set-up-environment-variables.ts',
    '<rootDir>/scripts/runtimeConfig/write.ts',
  ],
}

export default config
