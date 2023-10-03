import * as React from 'react'
import styled from '@emotion/styled'
import { Button } from '../../../Button/Button'
import type { DisplayProps } from 'styled-system'
import { display } from 'styled-system'
import { Link } from 'react-router-dom'

const ButtonSign = styled(Button as any)<DisplayProps>`
  ${display};
  cursor: pointer;
`
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
  return (
    <>
      <Link to={props.link} style={{ minWidth: 'auto' }}>
        <ButtonSign
          onClick={() => {
            console.log(`props.isMobile && menu.toggleMobilePanel()`)
          }}
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
        </ButtonSign>
      </Link>
    </>
  )
}
