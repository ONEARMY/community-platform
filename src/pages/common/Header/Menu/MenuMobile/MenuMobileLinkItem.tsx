import React from 'react'
import theme from 'src/themes/styled.theme'
import styled from 'styled-components'
import { Box } from 'rebass'
import { NavLink } from 'react-router-dom'
import MenuCurrent from 'src/assets/images/menu-current.svg'

interface IProps {
  path: string
  content: string
}

const PanelItem = styled(Box)`
  padding: ${theme.space[3]}px 0px;
`

const MenuLink = styled(NavLink).attrs(({ name }) => ({
  activeClassName: 'current',
}))`
  color: ${'black'};
  font-size: ${theme.fontSizes[2]}px;
  position: relative;
  > div {
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
      bottom: -16px;
      background-position: 50% 70%;
      background-image: url(${MenuCurrent});
      z-index: 0;
      background-repeat: no-repeat;
      background-size: contain;
      left: 50%;
      transform: translateX(-50%);
    }
  }
`

export class AccountButtons extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props)
  }
  render() {
    return (
      <>
        <PanelItem>
          <MenuLink to={this.props.path} data-cy="page-link">
            <div>{this.props.content}</div>
          </MenuLink>
        </PanelItem>
      </>
    )
  }
}

export default AccountButtons
