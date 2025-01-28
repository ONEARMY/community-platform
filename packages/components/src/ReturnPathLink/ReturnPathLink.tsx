import { Link } from '@remix-run/react'

import type { RemixLinkProps } from '@remix-run/react/dist/components'
import type { RefAttributes } from 'react'

type IProps = RemixLinkProps & RefAttributes<HTMLAnchorElement>

export const ReturnPathLink = (props: IProps) => {
  const to = `/${props.to}?returnUrl=${encodeURIComponent(location?.pathname)}`

  return (
    <Link {...props} to={to}>
      {props.children}
    </Link>
  )
}
