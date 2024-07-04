import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { SiteFooter } from '@onearmy.apps/components'

const isFooterVisible = (path) => {
  return (
    !path.startsWith('/map') && !path.startsWith('/academy') && path !== '/'
  )
}

const GlobalSiteFooter = () => {
  const location = useLocation()
  const [showFooter, setShowFooter] = useState(
    isFooterVisible(window.location.pathname),
  )

  useEffect(
    () => setShowFooter(isFooterVisible(location?.pathname)),
    [location],
  )

  return showFooter ? <SiteFooter /> : null
}

export default GlobalSiteFooter
