import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import envCompatible from 'vite-plugin-env-compatible'
import ViteTsConfigPathsPlugin from 'vite-tsconfig-paths'
import nodePolyfills from 'rollup-plugin-node-polyfills'

import fs from 'node:fs/promises'
import path from 'node:path'
import url from 'node:url'
import { createRequire } from 'node:module'
import type { PluginOption } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'build',
    rollupOptions: {
      plugins: [nodePolyfills()],
    },
  },
  define: {
    process: {},
  },
  plugins: [
    reactVirtualized(),
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
})

const WRONG_CODE = `import { bpfrpt_proptype_WindowScroller } from "../WindowScroller.js";`

function reactVirtualized(): PluginOption {
  return {
    name: 'flat:react-virtualized',
    // Note: we cannot use the `transform` hook here
    //       because libraries are pre-bundled in vite directly,
    //       plugins aren't able to hack that step currently.
    //       so instead we manually edit the file in node_modules.
    //       all we need is to find the timing before pre-bundling.
    configResolved: async () => {
      const require = createRequire(import.meta.url)
      const reactVirtualizedPath = require.resolve('react-virtualized')
      const { pathname: reactVirtualizedFilePath } = new url.URL(
        reactVirtualizedPath,
        import.meta.url,
      )
      const file = reactVirtualizedFilePath.replace(
        path.join('dist', 'commonjs', 'index.js'),
        path.join('dist', 'es', 'WindowScroller', 'utils', 'onScroll.js'),
      )
      const code = await fs.readFile(file, 'utf-8')
      const modified = code.replace(WRONG_CODE, '')
      await fs.writeFile(file, modified)
    },
  }
}
