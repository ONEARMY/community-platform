import React from 'react'
import { useLocation } from '@remix-run/react'
import ExternalEmbed from 'src/pages/Academy/ExternalEmbed/ExternalEmbed'

export const getFrameSrc = (base: string, path: string): string =>
  `${base}${path
    .split('/')
    .filter((str) => str !== 'academy' && Boolean(str))
    .join('/')}`

const Academy = () => {
  const location = useLocation()

  return (
    <ExternalEmbed
      src={getFrameSrc(
        import.meta.env.VITE_ACADEMY_RESOURCE ||
          process.env.VITE_ACADEMY_RESOURCE ||
          '',
        location.pathname,
      )}
    />
  )
}

export default Academy
