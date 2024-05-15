import { useCallback, useEffect, useRef } from 'react'
import { useBeforeUnload, useBlocker } from 'react-router-dom'

// You can abstract `useBlocker` to use the browser's `window.confirm` dialog to
// determine whether or not the user should navigate within the current origin.
// `useBlocker` can also be used in conjunction with `useBeforeUnload` to
// prevent navigation away from the current origin.
//
// IMPORTANT: There are edge cases with this behavior in which React Router
// cannot reliably access the correct location in the history stack. In such
// cases the user may attempt to stay on the page but the app navigates anyway,
// or the app may stay on the correct page but the browser's history stack gets
// out of whack. You should test your own implementation thoroughly to make sure
// the tradeoffs are right for your users.

export const usePrompt = (message: string, when: boolean) => {
  const blocker = useBlocker(
    useCallback(() => {
      // eslint-disable-next-line no-alert
      return !window.confirm(message)
    }, [message]),
  )
  const prevState = useRef(blocker.state)

  useEffect(() => {
    if (blocker.state === 'blocked') {
      blocker.reset()
    }
    prevState.current = blocker.state

    return () => {
      if (blocker && blocker.reset) {
        blocker.reset()
      }
    }
  }, [blocker])

  useBeforeUnload(
    useCallback(
      (event) => {
        if (when) {
          event.preventDefault()
          event.returnValue = message
        }
      },
      [message, when],
    ),
    { capture: true },
  )
}
