import { vitePlugin as remix } from '@remix-run/dev'
import react from '@vitejs/plugin-react'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import ViteTsConfigPathsPlugin from 'vite-tsconfig-paths'

import type { UserConfig as VitestUserConfigInterface } from 'vitest/config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const vitestConfig: VitestUserConfigInterface = {
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    teardownTimeout: 20000,
    testTimeout: 20000,
    coverage: {
      provider: 'v8',
      reporter: ['text'],
    },
    include: ['./src/**/*.test.?(c|m)[jt]s?(x)'],
    logHeapUsage: true,
    sequence: {
      hooks: 'list',
    },
  },
}

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    global: 'globalThis',
  },
  build: {
    sourcemap: process.env.NODE_ENV !== 'production', // to enable local server-side debugging
  },
  plugins: [
    !process.env.VITEST
      ? remix({
          appDirectory: './src',
          future: {
            v3_fetcherPersist: true,
            v3_relativeSplatPath: true,
            v3_throwAbortReason: true,
          },
        })
      : react(),
    // TODO - confirm if required (given manual resolutions below)
    ViteTsConfigPathsPlugin({
      root: './',
    }),
    // support import of svg files
    svgr(),
  ],
  // open browser with server (note, will open at 127.0.1 not localhost on node <17)
  // https://vitejs.dev/config/server-options.html#server-options
  ssr: {
    noExternal: ['remix-utils', '@mui/base', '@mui/utils', '@mui/types'],
  },
  resolve: {
    alias: {
      'oa-shared': resolve(__dirname, './shared/index.ts'),
      'oa-components': resolve(__dirname, './packages/components/src/index.ts'),
    },
  },
  test: vitestConfig.test,
})
