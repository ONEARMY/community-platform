import React from 'react'
import { useLocation } from 'react-router-dom'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import ExternalEmbed from 'src/pages/Academy/ExternalEmbed/ExternalEmbed'

export const getFrameSrc = (base, path): string =>
  `${base}${path
    .split('/')
    .filter((str) => str !== 'academy' && Boolean(str))
    .join('/')}`

const Academy = () => {
  const { stores } = useCommonStores()
  const location = useLocation()
  const src = stores.themeStore.currentTheme.academyResource

  return (
    // NOTE - for embed to work github.io site also must host at same path, i.e. /academy
    <ExternalEmbed src={getFrameSrc(src, location.pathname)} />
  )
}

export default Academy
