import { useCallback, useContext, useEffect } from 'react'
import { UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom'

const useConfirm = (confirmExit: () => boolean, when: boolean) => {
  const { navigator } = useContext(NavigationContext)

  useEffect(() => {
    if (!when) {
      return
    }

    const push = navigator.push

    navigator.push = (...args: Parameters<typeof push>) => {
      const result = confirmExit()
      if (result !== false) {
        push(...args)
      }
    }

    return () => {
      navigator.push = push
    }
  }, [navigator, confirmExit, when])
}

export const usePrompt = (message: string, when = true) => {
  useEffect(() => {
    if (when) {
      window.onbeforeunload = () => {
        return message
      }
    } else {
      window.onbeforeunload = null
    }

    return () => {
      window.onbeforeunload = null
    }
  }, [message, when])

  const confirmExit = useCallback(() => {
    // eslint-disable-next-line no-alert
    return window.confirm(message)
  }, [message])

  useConfirm(confirmExit, when)
}
