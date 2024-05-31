import react from '@vitejs/plugin-react'
import { resolve } from 'path'
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import envCompatible from 'vite-plugin-env-compatible'
import svgr from 'vite-plugin-svgr'
import ViteTsConfigPathsPlugin from 'vite-tsconfig-paths'

import type { UserConfig as VitestUserConfigInterface } from 'vitest/config'

const vitestConfig: VitestUserConfigInterface = {
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text'],
    },
    reporters: ['junit'],
    include: ['./src/**/*.{test}.?(c|m)[jt]s?(x)'],
    logHeapUsage: true,
  },
}

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'build',
  },
  define: {
    global: 'globalThis',
  },
  plugins: [
    react({
      babel: {
        parserOpts: {
          plugins: ['decorators-legacy'],
        },
      },
    }),
    // TODO - confirm if required (given manual resolutions below)
    ViteTsConfigPathsPlugin({
      root: './',
    }),
    // support import of svg files
    svgr(),
    // support REACT_APP variables accessed via process.env
    envCompatible({ prefix: 'REACT_APP_' }),
  ],
  // open browser with server (note, will open at 127.0.1 not localhost on node <17)
  // https://vitejs.dev/config/server-options.html#server-options
  server: {
    open: '/',
    port: 3000,
  },
  resolve: {
    alias: {
      'oa-shared': resolve(__dirname, './shared/index.ts'),
      'oa-components': resolve(__dirname, './packages/components/src/index.ts'),
    },
  },
  test: vitestConfig.test,
})
