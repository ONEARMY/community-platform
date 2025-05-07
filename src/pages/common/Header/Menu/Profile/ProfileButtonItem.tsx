import React, { useContext } from 'react'
import { Button, ReturnPathLink } from 'oa-components'

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

export const ProfileButtonItem = (props: IProps) => {
  const mobileMenuContext = useContext(MobileMenuContext)

  return (
    <ReturnPathLink to={props.link} style={{ minWidth: 'auto' }}>
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
    </ReturnPathLink>
  )
}
