import { reactRouter } from '@react-router/dev/vite';
import react from '@vitejs/plugin-react';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import ViteTsConfigPathsPlugin from 'vite-tsconfig-paths';
import { VitePWA } from 'vite-plugin-pwa';

import type { ViteUserConfig } from 'vitest/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const vitestConfig: ViteUserConfig = {
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
};

export default defineConfig({
  base: '/academy/',

  define: {
    global: 'globalThis',
  },

  build: {
    target: ['es2020'],
    sourcemap: process.env.NODE_ENV !== 'production',

    commonjsOptions: {
      transformMixedEsModules: true,
    },

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes('node_modules/leaflet') ||
            id.includes('node_modules/react-leaflet') ||
            id.includes('node_modules/@react-leaflet')
          ) {
            return 'leaflet';
          }
        },
      },
    },
  },

  plugins: [
    !process.env.VITEST ? reactRouter() : react(),

    ViteTsConfigPathsPlugin({
      root: './',
    }),

    svgr(),

    // ✅ UPDATED PWA CONFIG
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      strategies: 'generateSW',

      // ❌ IMPORTANT: disable static manifest
      manifest: false,

      base: '/academy/',

      devOptions: {
        enabled: true,
      },

      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,

        runtimeCaching: [
          // ✅ Static assets only
          {
            urlPattern: ({ request }) =>
              ['script', 'style', 'image', 'font'].includes(request.destination),

            handler: 'CacheFirst',

            options: {
              cacheName: 'static-assets',

              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },

          // ❌ NEVER cache API
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api'),
            handler: 'NetworkOnly',
          },

          // ❌ NEVER cache Supabase
          {
            urlPattern: ({ url }) =>
              url.hostname.includes('supabase'),
            handler: 'NetworkOnly',
          },

          // ✅ HTML navigation (SSR pages)
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
          },
        ],
      },
    }),
  ],

  ssr: {
    noExternal: [
      'remix-utils',
      '@mui/base',
      '@mui/utils',
      '@mui/types',
    ],
  },

  resolve: {
    alias: {
      'oa-shared': resolve(__dirname, './shared/index.ts'),
      'oa-components': resolve(
        __dirname,
        './packages/components/src/index.ts'
      ),
    },
  },

  test: vitestConfig.test,
});