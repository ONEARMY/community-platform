import react from '@vitejs/plugin-react'
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

import type { UserConfig as VitestUserConfigInterface } from 'vitest/config'

const vitestConfig: VitestUserConfigInterface = {
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
    },
    reporters: ['junit'],
    include: ['./src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
  },
}
// eslint-disable-next-line import/no-default-export
export default defineConfig({
  plugins: [react(), svgr()],
  test: vitestConfig.test,
})
