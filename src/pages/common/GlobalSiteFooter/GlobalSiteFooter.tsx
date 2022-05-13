import { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { SiteFooter } from 'oa-components'

const isFooterVisible = (path) => {
  return (
    !path.startsWith('/map') && !path.startsWith('/academy') && path !== '/'
  )
}

const GlobalSiteFooter = () => {
  const history = useHistory()
  const [showFooter, setShowFooter] = useState(
    isFooterVisible(window.location.pathname),
  )

  useEffect(
    () =>
      history.listen((location) => {
        setShowFooter(isFooterVisible(location?.pathname))
      }),
    [history],
  )

  return showFooter ? <SiteFooter /> : null
}

export default GlobalSiteFooter
