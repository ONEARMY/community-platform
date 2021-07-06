/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

import { clientsClaim } from 'workbox-core'
import { ExpirationPlugin } from 'workbox-expiration'
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { BackgroundSyncPlugin } from 'workbox-background-sync'
import { PrecacheEntry } from 'workbox-precaching/_types'
import { setCacheNameDetails } from 'workbox-core'

setCacheNameDetails({
  prefix: 'oa',
  suffix: 'v1',
  precache: 'core',
  runtime: 'runtime',
})

declare const self: ServiceWorkerGlobalScope

// if the page does not have an active service worker take control immediately
clientsClaim()

// This variable must be present somewhere in your service worker file,
// even if you decide not to use precaching. See https://cra.link/PWA
const fullManifest = self.__WB_MANIFEST

// just cache index, allow others to be added to runtime cache instead (better for lazy loading)
const coreManifest = (fullManifest as PrecacheEntry[]).filter(
  entry => entry.url === '/index.html',
)
precacheAndRoute(coreManifest)

// static assets are already cachebusted with their file names so can just serve cacheFirst
// for same origin (https://developers.google.com/web/tools/workbox/modules/workbox-routing)
registerRoute(new RegExp('/static/'), new CacheFirst())

// Set up App Shell-style routing, so that all navigation requests
// are fulfilled with your index.html shell. Learn more at
// https://developers.google.com/web/fundamentals/architecture/app-shell
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$')
registerRoute(
  // Return false to exempt requests from being fulfilled by index.html.
  ({ request, url }: { request: Request; url: URL }) => {
    // If this isn't a navigation, skip.
    if (request.mode !== 'navigate') {
      return false
    }

    // If this is a URL that starts with /_, skip.
    if (url.pathname.startsWith('/_')) {
      return false
    }

    // If this looks like a URL for a resource, because it contains
    // a file extension, skip.
    if (url.pathname.match(fileExtensionRegexp)) {
      return false
    }

    // Return true to signal that we want to use the handler.
    return true
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html'),
)

// image assets not hard-coded
registerRoute(
  ({ request }) => request.destination === 'image',
  new StaleWhileRevalidate({
    cacheName: 'oa-images',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 1000,
      }),
      new BackgroundSyncPlugin('oa-images-background', {
        maxRetentionTime: 60 * 60 * 24,
      }),
      // cache opaque responses in case of cors issues
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
    matchOptions: {
      ignoreSearch: true,
    },
    fetchOptions: {
      credentials: 'same-origin',
      mode: 'cors',
    },
  }),
)

// all other storage assets
registerRoute(
  new RegExp(/^https:\/\/firebasestorage\.googleapis\.com\//gi),
  new StaleWhileRevalidate({
    cacheName: 'oa-other',
    plugins: [],
    matchOptions: {
      ignoreSearch: true,
    },
    fetchOptions: {
      credentials: 'same-origin',
      mode: 'cors',
    },
  }),
)

// If adding further custom routes or general fallback should do so carefully
// to avoid adding rules for routes that should be bypassing service worker (e.g. below)

// This is bad (!) https://github.com/GoogleChrome/workbox/issues/2692
// registerRoute(
//   new RegExp('^https://firestore\\.googleapis\\.com/'),
//   new NetworkOnly(),
// )

// allow skip-waiting message to be sent from client
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
