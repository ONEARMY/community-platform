import type { InitialOptionsTsJest } from 'ts-jest/dist/types'

const config: InitialOptionsTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  setupFiles: ['<rootDir>/scripts/set-up-environment-variables.ts'],
}

export default config
