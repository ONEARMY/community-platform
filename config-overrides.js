/*
    Custom overrides for default create-react-app build
    Automatically read by react-app-rewired scripts

    Overrides:
    - Add custom service worker behaviour
*/
//eslint-disable-next-line
const WorkboxWebpackPlugin = require('workbox-webpack-plugin')
module.exports = function override(config, env) {
  config.plugins = config.plugins.map(plugin => {
    if (plugin.constructor.name === 'GenerateSW') {
      return swPlugin()
    }
    return plugin
  })
  return config
}

/**
 * Custom service worker plugin
 */
function swPlugin() {
  return new WorkboxWebpackPlugin.GenerateSW({
    cacheId: 'oa',
    clientsClaim: true,
    skipWaiting: true,

    runtimeCaching: [
      {
        urlPattern: new RegExp(/.*\.(?:png|gif|jpg|jpeg|webp|svg).*/gi),
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'oa-images',
          fetchOptions: {
            credentials: 'same-origin',
            mode: 'cors',
          },
          backgroundSync: {
            name: 'oa-images-background',
            options: {
              maxRetentionTime: 60 * 60 * 24,
            },
          },
          expiration: {
            maxAgeSeconds: 60 * 60 * 24 * 365,
            maxEntries: 1000,
          },
          matchOptions: {
            ignoreSearch: true,
          },
        },
      },
      {
        urlPattern: new RegExp('^https://firebasestorage\\.googleapis\\.com/'),
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'oa-other',
          fetchOptions: {
            credentials: 'same-origin',
            mode: 'cors',
          },
          matchOptions: {
            ignoreSearch: true,
          },
        },
      },
      {
        urlPattern: new RegExp('^https://firestore\\.googleapis\\.com/'),
        handler: 'NetworkOnly',
      },
      {
        urlPattern: new RegExp(/.chunk./), // generated build files (contains hashing so cacheFirst should be fine)
        handler: 'CacheFirst',
      },
      {
        urlPattern: new RegExp(/.(?:woff|woff2|ttf|eot)/gi), // fonts
        handler: 'CacheFirst',
      },
      {
        urlPattern: new RegExp('static/media'), // svgs and other outputs from platform build
        handler: 'StaleWhileRevalidate',
      },
      {
        urlPattern: new RegExp('favicon.ico'), // svgs and other outputs from platform build
        handler: 'StaleWhileRevalidate',
      },
    ],
    // excludes from precache (still can include runtime cache)
    exclude: [
      /\.map$/, // exclude map files, manifest, images, txt (e.g. license)
      /asset-manifest\.json$/,
      /.(?:png|jpg|jpeg|svg|txt|ico)$/,
      /.chunk./, // exclude lazy-loaded chunks
      /.(?:woff|woff2|ttf|eot)/, // exclude fonts
    ],
    importWorkboxFrom: 'cdn',
    navigateFallback: '/index.html',
    navigateFallbackWhitelist: [/^(?!\/__)/],
    navigateFallbackBlacklist: [
      // Exclude URLs starting with /_, as they're likely an API call
      new RegExp('^/_'),
      // Exclude URLs containing a dot, as they're likely a resource in
      // public/ and not a SPA route
      new RegExp('/[^/]+\\.[^/]+$'),
    ],
  })
}
