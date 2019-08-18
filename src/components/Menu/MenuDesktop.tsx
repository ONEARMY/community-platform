import React from 'react'
import { NavLink } from 'react-router-dom'
import { COMMUNITY_PAGES } from 'src/pages/PageList'
import theme from 'src/themes/styled.preciousplastic'
import { Flex } from 'rebass'
import styled from 'styled-components'

const MenuLink = styled(NavLink).attrs(({ name }) => ({
  activeClassName: 'current',
}))`
  ${theme.header.menuDesktop.item.style}
  &.current {
    ${theme.header.menuDesktop.item.current.style}
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
