import React from 'react'
import { Link } from '@remix-run/react'
import { Button } from 'oa-components'

import { MobileMenuContext } from '../../MobileMenuContext'

interface IProps {
  link: string
  text: string
  variant: string
  style?: React.CSSProperties
  isMobile?: boolean
}

interface IProps {
  sx?: any
}

const ProfileButtonItem = (props: IProps) => {
  const mobileMenuContext = React.useContext(MobileMenuContext)

  return (
    <Link to={props.link} style={{ minWidth: 'auto' }}>
      <Button
        type="button"
        onClick={() => props.isMobile && mobileMenuContext.setIsVisible(false)}
        variant={props.variant}
        {...(props.isMobile ? { large: true } : {})}
        data-cy={props.text.toLowerCase()}
        sx={{
          ...props.sx,
          display: props.isMobile
            ? ['flex', 'flex', 'none']
            : ['none', 'none', 'flex'],
        }}
      >
        {props.text}
      </Button>
    </Link>
  )
}

export default ProfileButtonItem
