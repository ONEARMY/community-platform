import React from 'react'
import { NavLink } from 'react-router-dom'
import { COMMUNITY_PAGES } from 'src/pages/PageList'
import theme from 'src/themes/styled.theme'
import { Flex } from 'rebass/styled-components'
import styled from 'styled-components'
import MenuCurrent from 'src/assets/images/menu-current.svg'
import { zIndex } from 'src/themes/styled.theme'

const MenuLink = styled(NavLink).attrs(({ name }) => ({
  activeClassName: 'current',
}))`
  padding: 0px ${theme.space[4]}px;
  color: ${'black'};
  position: relative;
  > div {
    z-index: ${zIndex.default};
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
      z-index: ${zIndex.level};
      background-repeat: no-repeat;
      background-size: contain;
      left: 50%;
      transform: translateX(-50%);
    }
  }
`

export class MenuDesktop extends React.Component {
  render() {
    return (
      <>
        <Flex alignItems={'center'}>
          {COMMUNITY_PAGES.map(page => (
            <Flex key={page.path}>
              <MenuLink to={page.path} data-cy="page-link">
                <Flex>{page.title}</Flex>
              </MenuLink>
            </Flex>
          ))}
        </Flex>
      </>
    )
  }
}

export default MenuDesktop
