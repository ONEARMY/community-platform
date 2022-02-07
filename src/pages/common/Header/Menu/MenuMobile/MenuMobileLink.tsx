import * as React from 'react'
import theme from 'src/themes/styled.theme'
import styled from 'styled-components'
import { Box } from 'rebass'
import { NavLink } from 'react-router-dom'
import MenuCurrent from 'src/assets/images/menu-current.svg'
import { observer, inject } from 'mobx-react'
import { MobileMenuStore } from 'src/stores/MobileMenu/mobilemenu.store'

interface IProps {
  path: string
  content: string
  style?: React.CSSProperties
  onClick?: () => void
}

interface IInjectedProps extends IProps {
  mobileMenuStore: MobileMenuStore
}

const PanelItem = styled(Box)`
  padding: ${theme.space[3]}px 0px;
`

const MenuLink = styled(NavLink).attrs(() => ({
  activeClassName: 'current',
}))`
  color: ${'black'};
  font-size: ${theme.fontSizes[2]}px;
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
      background-color: ${theme.colors.yellow.base};
      mask-size: contain;
      mask-image: url(${MenuCurrent});
      mask-repeat: no-repeat;
      z-index: 0;
      left: 50%;
      transform: translateX(-50%);
    }
  }
`
@inject('mobileMenuStore')
@observer
export class MenuMobileLink extends React.Component<IProps> {
  // eslint-disable-next-line
  constructor(props: IProps) {
    super(props)
  }

  get injected() {
    return this.props as IInjectedProps
  }

  render() {
    const menu = this.injected.mobileMenuStore
    return (
      <>
        <PanelItem data-cy="mobile-menu-item">
          <MenuLink
            to={this.props.path}
            onClick={() => {
              menu.toggleMobilePanel()
              if (this.props.onClick) {
                this.props.onClick()
              }
            }}
            style={this.props.style}
          >
            <span>{this.props.content}</span>
          </MenuLink>
        </PanelItem>
      </>
    )
  }
}

export default MenuMobileLink
