/// <reference types='vitest' />
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import viteTsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/community-platform',

  server: {
    port: 3000,
    host: 'localhost',
  },

  preview: {
    port: 4300,
    host: 'localhost',
  },

  plugins: [
    react(),
    nxViteTsPaths({}),
    viteTsConfigPaths({
      root: '../../',
    }),
  ],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  define: {
    'process.env': {},
  },
  build: {
    outDir: '../../dist/apps/community-platform',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  test: {
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    environment: 'jsdom',
    include: ['./src/**/*.test.{ts,tsx}'],
    teardownTimeout: 15000,
    testTimeout: 15000,
    coverage: {
      provider: 'v8',
      reporter: ['text'],
    },
    logHeapUsage: true,
    sequence: {
      hooks: 'list',
    },
  },
})
