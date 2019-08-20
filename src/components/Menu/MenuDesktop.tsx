import React from 'react'
import { NavLink } from 'react-router-dom'
import { COMMUNITY_PAGES } from 'src/pages/PageList'
import theme from 'src/themes/styled.theme'
import { Flex } from 'rebass'
import styled from 'styled-components'
import MenuCurrent from 'src/assets/images/menu-current.svg'

const MenuLink = styled(NavLink).attrs(({ name }) => ({
  activeClassName: 'current',
}))`
  padding: 0px ${theme.space[4]}px;
  color: ${'black'};
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
      bottom: -6px;
      background-image: url(${MenuCurrent});
      z-index: 0;
      background-repeat: no-repeat;
      background-size: contain;
      left: 50%;
      transform: translateX(-50%);
    }
  }
`
export class DesktopMenu extends React.Component {
  render() {
    return (
      <>
        <Flex alignItems={'center'} px={2}>
          {COMMUNITY_PAGES.map(page => (
            <Flex>
              <MenuLink to={page.path} key={page.path}>
                <Flex>{page.title}</Flex>
              </MenuLink>
            </Flex>
          ))}
        </Flex>
      </>
    )
  }
}

export default DesktopMenu
