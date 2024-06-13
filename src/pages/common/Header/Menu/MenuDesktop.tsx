import { NavLink } from 'react-router-dom'
import styled from '@emotion/styled'
import MenuCurrent from 'src/assets/images/menu-current.svg'
import { AuthWrapper } from 'src/common/AuthWrapper'
import { getSupportedModules } from 'src/modules'
import { getAvailablePageList } from 'src/pages/PageList'
import { Flex } from 'theme-ui'

const MenuLink = styled(NavLink)`
  padding: 0px ${(props) => props.theme.space[4]}px;
  color: ${'black'};
  position: relative;
  > div {
    z-index: ${(props) => props.theme.zIndex.default};
    position: relative;
    &:hover {
      opacity: 0.7;
    }
  }
  &.active {
    &:after {
      content: '';
      width: 70px;
      height: 20px;
      display: block;
      position: absolute;
      bottom: -6px;
      background-color: ${(props) => props.theme.colors.accent.base};
      mask-size: contain;
      mask-image: url(\"${MenuCurrent}\");
      mask-repeat: no-repeat;
      z-index: ${(props) => props.theme.zIndex.level};
      left: 50%;
      transform: translateX(-50%);
      pointer-events: none;
    }
  }
`

export const MenuDesktop = () => (
  <Flex sx={{ alignItems: 'center', width: '100%' }}>
    {getAvailablePageList(getSupportedModules()).map((page) => {
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
)

export default MenuDesktop
