import { useContext, useMemo } from 'react'
import { useLocation } from 'react-router'
import { SiteFooter } from 'oa-components'

import { EnvironmentContext } from '../EnvironmentContext'

const GlobalSiteFooter = () => {
  const env = useContext(EnvironmentContext)
  const location = useLocation()

  const showFooter = useMemo(() => {
    const path = location?.pathname

    return (
      !path.startsWith('/map') && !path.startsWith('/academy') && path !== '/'
    )
  }, [location?.pathname])

  return showFooter ? (
    <SiteFooter siteName={env?.VITE_SITE_NAME || 'Community Platform'} />
  ) : null
}

export default GlobalSiteFooter
