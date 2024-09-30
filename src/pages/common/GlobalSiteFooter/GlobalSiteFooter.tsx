import { useEffect, useState } from 'react'
import { useLocation } from '@remix-run/react'
import { SiteFooter } from 'oa-components'

const isFooterVisible = (path) => {
  return (
    !path.startsWith('/map') && !path.startsWith('/academy') && path !== '/'
  )
}

const GlobalSiteFooter = () => {
  const location = useLocation()
  const [showFooter, setShowFooter] = useState(
    isFooterVisible(location.pathname),
  )

  useEffect(
    () => setShowFooter(isFooterVisible(location?.pathname)),
    [location],
  )

  return showFooter ? <SiteFooter /> : null
}

export default GlobalSiteFooter
