import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import envCompatible from 'vite-plugin-env-compatible'
import ViteTsConfigPathsPlugin from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
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
  },
  resolve: {
    // TODO - determine why vite can't import from workspaces (or just use these paths instead)
    alias: [
      {
        find: 'src',
        replacement: resolve(__dirname, 'src'),
      },
      {
        find: 'oa-shared',
        replacement: resolve(__dirname, 'shared/index.ts'),
      },
      {
        find: 'oa-components',
        replacement: resolve(__dirname, 'packages/components/src/index.ts'),
      },
    ],
  },
  optimizeDeps: {
    esbuildOptions: {
      // support calls to 'global' (required for pino-logflare)
      define: {
        global: 'globalThis',
      },
      // support calls to 'buffer' (required for pino-logflare)
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
      ],
    },
  },
})
