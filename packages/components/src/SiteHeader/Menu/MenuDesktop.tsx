import { NavLink } from 'react-router-dom'
import { Flex } from 'theme-ui'
import styled from '@emotion/styled'
import MenuCurrent from '../../../assets/images/menu-current.svg'

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
  &.current {
    &:after {
      content: '';
      width: 70px;
      height: 20px;
      display: block;
      position: absolute;
      bottom: -6px;
      background-color: ${(props) => props.theme.colors.accent.base};
      mask-size: contain;
      mask-image: url(${MenuCurrent});
      mask-repeat: no-repeat;
      z-index: ${(props) => props.theme.zIndex.level};
      left: 50%;
      transform: translateX(-50%);
      pointer-events: none;
    }
  }
`

MenuLink.defaultProps = {
  activeClassName: 'current',
}

export const MenuDesktop = (props:{
  pageList: any[]
}) => {
  const { pageList } = props
  return (
    <>
      <Flex sx={{ alignItems: 'center', width: '100%' }}>
        {(pageList || []).map((page: any) => {
          return (
            <Flex key={page.path}>
              <MenuLink to={page.path} data-cy="page-link">
                <Flex>{page.title}</Flex>
              </MenuLink>
            </Flex>
          )
        })}
      </Flex>
    </>
  )
}
