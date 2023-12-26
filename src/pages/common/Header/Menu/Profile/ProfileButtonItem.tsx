import React from 'react'
import { Button } from 'oa-components'
import { observer } from 'mobx-react'
import { Link } from 'react-router-dom'

import { useCommonStores } from 'src/index'

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

const ProfileButtonItem = observer((props: IProps) => {
  const { mobileMenuStore } = useCommonStores().stores

  return (
    <Link to={props.link} style={{ minWidth: 'auto' }}>
      <Button
        onClick={() => props.isMobile && mobileMenuStore.toggleMobilePanel()}
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
})

export default ProfileButtonItem
