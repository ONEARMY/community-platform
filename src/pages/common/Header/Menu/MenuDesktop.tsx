import { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { getAvailablePageList } from 'src/pages/PageList'
import { Flex } from 'rebass'
import styled from '@emotion/styled'
import MenuCurrent from 'src/assets/images/menu-current.svg'
import { AuthWrapper } from 'src/components/Auth/AuthWrapper'
import { getSupportedModules } from 'src/modules'

const MenuLink = styled(NavLink)`
  padding: 0px ${props => props.theme.space[4]}px;
  color: ${'black'};
  position: relative;
  > div {
    z-index: ${props => props.theme.zIndex.default};
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
      background-color: ${props => props.theme.colors.yellow.base};
      mask-size: contain;
      mask-image: url(${MenuCurrent});
      mask-repeat: no-repeat;
      z-index: ${props => props.theme.zIndex.level};
      left: 50%;
      transform: translateX(-50%);
      pointer-events: none;
    }
  }
`

MenuLink.defaultProps = {
  activeClassName: 'current',
}

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
