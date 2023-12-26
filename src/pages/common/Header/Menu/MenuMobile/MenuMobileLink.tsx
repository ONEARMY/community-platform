import React from 'react'
import styled from '@emotion/styled'
import { Box } from 'theme-ui'
import { NavLink } from 'react-router-dom'
import { observer } from 'mobx-react'

import MenuCurrent from 'src/assets/images/menu-current.svg'
import { useCommonStores } from 'src/index'

interface IProps {
  path: string
  content: string
  style?: React.CSSProperties
  onClick?: () => void
}

const PanelItem = styled(Box)`
  padding: ${(props) => props.theme.space[3]}px 0px;
`

const MenuLink = styled(NavLink)`
  color: ${(props) => props.theme.colors.black};
  font-size: ${(props) => props.theme.fontSizes[2]}px;
  position: relative;
  > span {
    z-index: 1;
    position: relative;
    &:hover {
      opacity: 0.7;
    }
  }
  &.current {
    &:after {
      content: '';
      width: 70px;
      height: 20px;
      display: block;
      position: absolute;
      bottom: -5px;
      background-color: ${(props) => props.theme.colors.accent.base};
      mask-size: contain;
      mask-image: url(${MenuCurrent});
      mask-repeat: no-repeat;
      z-index: 0;
      left: 50%;
      transform: translateX(-50%);
    }
  }
`

const MenuMobileLink = observer((props: IProps) => {
  const { mobileMenuStore } = useCommonStores().stores

  return (
    <PanelItem data-cy="mobile-menu-item">
      <MenuLink
        to={props.path}
        onClick={() => {
          mobileMenuStore.toggleMobilePanel()
          if (props.onClick) {
            props.onClick()
          }
        }}
        style={props.style}
        className={({ isActive }) => (isActive ? 'current' : '')}
      >
        <span>{props.content}</span>
      </MenuLink>
    </PanelItem>
  )
})

export default MenuMobileLink
