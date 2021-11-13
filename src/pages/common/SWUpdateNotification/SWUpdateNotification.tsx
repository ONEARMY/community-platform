import { memo, useEffect, useState } from 'react'

import * as serviceWorkerRegistration from 'src/serviceWorkerRegistration'
import { Prompt } from 'react-router'
import { logger } from 'src/logger'

/**
 * Handle the registration and update of service worker
 * When a new service worker is detected let it take control of the current page (skipWaiting)
 * and refresh the page the next time the user attemps a navigation action
 **/

export const SWUpdateNotification = memo(() => {
  const [reloadRequired, setReloadRequired] = useState(false)
  const [swLoaded, setSWLoaded] = useState(false)

  useEffect(() => {
    if (!swLoaded) {
      logger.debug('loading sw')
      // register service worker, activating immediately (skipWaiting) and prompt reload
      serviceWorkerRegistration.register({
        handleSWControlling: () => {
          logger.debug('new sw controlling')
          setReloadRequired(true)
        },
        handleSWWaiting: wb => wb.messageSkipWaiting(),
      })
      setSWLoaded(true)
    }
  })

  // If a new service worker has been loaded prevent route changes (which will use old sw assets)
  // and force a page refresh instead when the user goes to navigate
  return (
    <>
      <Prompt
        when={reloadRequired}
        message={location => {
          // navigate to the target page, but via window navigation to reload the service worker
          window.location.assign(location.pathname)
          // allow the transition to proceed as normal (don't block the location assign)
          return true
        }}
      />
    </>
  )
})
SWUpdateNotification.displayName = 'SWUpdateNotification'
