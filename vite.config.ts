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

// https://vitejs.dev/config/
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
          // Split leaflet into separate chunk
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

    // ✅ PWA Plugin Added Here
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      strategies: 'generateSW',
      base: '/academy/',
      devOptions: {
        enabled: true,
      },      

      manifest: {
        name:
          process.env.VITE_APP_NAME || 'Community App',

        short_name:
          process.env.VITE_APP_SHORT_NAME || 'Community',

        theme_color:
          process.env.VITE_THEME_COLOR || '#1976d2',

        background_color: '#ffffff',

        display: 'standalone',

        start_url: '/academy',
        scope: '/academy/',

        icons: [
          {
            src: '/icon/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        screenshots: [
        {
          src: '/screenshots/mobile.png',
          sizes: '540x720',
          type: 'image/png'
        },
        {
          src: '/screenshots/desktop.png',
          sizes: '1280x800',
          type: 'image/png',
          form_factor: 'wide'
        }
      ]
      },

      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ request }) =>
              request.destination === 'script' ||
              request.destination === 'style' ||
              request.destination === 'image',

            handler: 'CacheFirst',

            options: {
              cacheName: 'static-assets',

              expiration: {
                maxEntries: 100,
                maxAgeSeconds:
                  60 * 60 * 24 * 30, // 30 days
              },
            },
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
      'oa-shared': resolve(
        __dirname,
        './shared/index.ts'
      ),

      'oa-components': resolve(
        __dirname,
        './packages/components/src/index.ts'
      ),
    },
  },

  test: vitestConfig.test,
});