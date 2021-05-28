// https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle#clientsclaim

import { Workbox } from 'workbox-window'

// initial code adapted from create-react-app (v4)

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/,
    ),
)

interface RegisterSWCallback {
  /** if waiting sw will not take control until notified to do so */
  handleSWWaiting: (wb: Workbox) => void
  /** when sw controlling page will likely need a reload */
  handleSWControlling: () => void
}

export function register(callback: RegisterSWCallback) {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    // The URL constructor is available in all browsers that support SW.
    const publicUrl = new URL(
      process.env.PUBLIC_URL as string,
      window.location.href,
    )
    if (publicUrl.origin !== window.location.origin) {
      // Our service worker won't work if PUBLIC_URL is on a different origin
      // from what our page is served on. This might happen if a CDN is used to
      // serve assets; see https://github.com/facebook/create-react-app/issues/2374
      return
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`

      if (isLocalhost) {
        // This is running on localhost. Let's check if a service worker still exists or not.
        checkValidServiceWorker(swUrl, callback)
      } else {
        // Is not localhost. Just register service worker
        registerValidSW(swUrl, callback)
      }
    })
  }
}

/**
 * Register a service worker (custom implementation)
 * If existing service worker exists respond to waiting event
 * adapted from https://developers.google.com/web/tools/workbox/guides/advanced-recipes
 * alternate: https://redfin.engineering/how-to-fix-the-refresh-button-when-using-service-workers-a8e27af6df68
 */
function registerValidSW(swUrl: string, callback: RegisterSWCallback) {
  const wb = new Workbox(swUrl)
  wb.addEventListener('waiting', () => {
    // only trigger controlling callback if previously waiting sw activated (i.e. not first ever load)
    wb.addEventListener('controlling', () => {
      callback.handleSWControlling()
    })
    callback.handleSWWaiting(wb)
  })
  wb.register()
}

function checkValidServiceWorker(swUrl: string, callback: RegisterSWCallback) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then(response => {
      // Ensure service worker exists, and that we really are getting a JS file.
      const contentType = response.headers.get('content-type')
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            window.location.reload()
          })
        })
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl, callback)
      }
    })
    .catch(() => {
      console.log(
        'No internet connection found. App is running in offline mode.',
      )
    })
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister()
      })
      .catch(error => {
        console.error(error.message)
      })
  }
}
