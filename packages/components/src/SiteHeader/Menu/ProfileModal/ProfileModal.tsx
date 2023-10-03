import { Box, Flex } from 'theme-ui'
import styled from '@emotion/styled'
import { NavLink } from 'react-router-dom'
// TODO: Remove direct usage of Theme
import { preciousPlasticTheme } from 'oa-themes'
const theme = preciousPlasticTheme.styles

const ModalContainer = styled(Box)`
  max-width: 100%;
  max-height: 100%;
  position: absolute;
  right: 10px;
  top: 60px;
  z-index: ${theme.zIndex.modalProfile};
  height: 100%;
`
const ModalContainerInner = styled(Box)`
  z-index: ${theme.zIndex.modalProfile};
  position: relative;
  background: white;
  border: 2px solid black;
  border-radius: 5px;
  overflow: hidden;
`

const ModalLink = styled(NavLink)`
  z-index: ${theme.zIndex.modalProfile};
  display: flex;
  flex-direction: column;
  color: ${theme.colors.black};
  padding: 10px 30px 10px 30px;
  text-align: left;
  width: 100%;
  max-width: 100%;
  max-height: 100%;

  &:hover,
  &:focus,
  &:active,
  &.current {
    background-color: ${theme.colors.background};
  }
`

ModalLink.defaultProps = {
  activeClassName: 'current',
}

const LogoutButton = styled.button`
  font-family: inherit;
  font-size: inherit;
  color: inherit;
  text-align: inherit;
  padding: 10px 30px 10px 30px;
  width: 100%;
  background: inherit;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: ${theme.colors.background};
  }
`

export const ProfileModal = (props: any) => {
  const { username, pageList } = props
  return (
    <ModalContainer data-cy="user-menu-list">
      <ModalContainerInner>
        <Flex>
          <ModalLink to={'/u/' + username} data-cy="menu-Profile">
            Profile
          </ModalLink>
        </Flex>
        {pageList.map((page: any, idx: number) => (
          <Flex key={idx}>
            <ModalLink to={page.path} data-cy={`menu-${page.title}`}>
              {page.title}
            </ModalLink>
          </Flex>
        ))}
        <Flex>
          <LogoutButton
            onClick={() => {
              // eslint-disable-next-line no-console
              console.log(`TODO:menu.toggleMobilePanel()
              this.logout()
              `)
            }}
            data-cy="menu-Logout"
          >
            Log out
          </LogoutButton>
        </Flex>
      </ModalContainerInner>
    </ModalContainer>
  )
}
