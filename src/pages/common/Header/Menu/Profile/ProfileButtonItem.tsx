import React, { useContext } from 'react'
import { Button, ReturnPathLink } from 'oa-components'

import { MenusContext } from '../../MenusContext'

interface IProps {
  link: string
  text: string
  variant: string
  style?: React.CSSProperties
  sx?: any
}

export const ProfileButtonItem = (props: IProps) => {
  const menusContext = useContext(MenusContext)

  return (
    <ReturnPathLink to={props.link} style={{ minWidth: 'auto' }}>
      <Button
        type="button"
        onClick={menusContext.closeAll}
        variant={props.variant}
        data-cy={props.text.toLowerCase()}
        sx={{
          ...props.sx,
        }}
      >
        {props.text}
      </Button>
    </ReturnPathLink>
  )
}
