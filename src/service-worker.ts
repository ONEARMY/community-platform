/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

declare const self: ServiceWorkerGlobalScope

// This variable must be present somewhere in your service worker file,
// even if you decide not to use precaching. See https://cra.link/PWA
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _fullManifest = (self as any).__WB_MANIFEST

self.addEventListener('install', (event: any) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

export {}
