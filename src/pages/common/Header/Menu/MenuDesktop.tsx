import { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { getAvailablePageList } from 'src/pages/PageList'
import theme from 'src/themes/styled.theme'
import { Flex } from 'rebass/styled-components'
import styled from 'styled-components'
import MenuCurrent from 'src/assets/images/menu-current.svg'
import { zIndex } from 'src/themes/styled.theme'
import { AuthWrapper } from 'src/components/Auth/AuthWrapper'
import { getSupportedModules } from 'src/modules'


const MenuLink = styled(NavLink).attrs(() => ({
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
      background-color: ${theme.colors.yellow.base};
      mask-size: contain;
      mask-image: url(${MenuCurrent});
      mask-repeat: no-repeat;
      z-index: ${zIndex.level};
      left: 50%;
      transform: translateX(-50%);
      pointer-events: none;
    }
  }
`

export class MenuDesktop extends Component {
  render() {
    return (
      <>
        <Flex alignItems={'center'}>
          {getAvailablePageList(getSupportedModules()).map(page => {
            const link = (
              <Flex key={page.path}>
                <MenuLink to={page.path} data-cy="page-link">
                  <Flex>{page.title}</Flex>
                </MenuLink>
              </Flex>
            )
            return page.requiredRole ? (
              <AuthWrapper roleRequired={page.requiredRole} key={page.path}>
                {link}
              </AuthWrapper>
            ) : (
              link
            )
          })}
        </Flex>
      </>
    )
  }
}

export default MenuDesktop
