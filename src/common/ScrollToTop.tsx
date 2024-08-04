import { useEffect } from 'react'
import { useLocation } from '@remix-run/react'

export const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
