import react from '@vitejs/plugin-react';
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

import type { ViteUserConfig } from 'vitest/config';

const vitestConfig: ViteUserConfig = {
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
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
};
// eslint-disable-next-line import/no-default-export
export default defineConfig({
  plugins: [react(), svgr()],
  test: vitestConfig.test,
});
