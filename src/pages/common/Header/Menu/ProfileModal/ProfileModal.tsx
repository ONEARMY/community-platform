import React from 'react'
import styled from '@emotion/styled'
import { NavLink } from '@remix-run/react'
import { observer } from 'mobx-react'
import { preciousPlasticTheme } from 'oa-themes'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { COMMUNITY_PAGES_PROFILE } from 'src/pages/PageList'
import { Box, Flex } from 'theme-ui'

import { AuthWrapper } from '../../../../../common/AuthWrapper'

// TODO: Remove direct usage of Theme
const theme = preciousPlasticTheme.styles

interface IProps {
  username: string
}

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

export const ProfileModal = observer((props: IProps) => {
  const { userStore } = useCommonStores().stores

  const logout = () => {
    userStore.logout()
  }

  const { username } = props
  return (
    <ModalContainer data-cy="user-menu-list">
      <ModalContainerInner>
        <Flex>
          <ModalLink
            to={'/u/' + username}
            data-cy="menu-Profile"
            className={({ isActive }) => (isActive ? 'current' : '')}
          >
            Profile
          </ModalLink>
        </Flex>
        {COMMUNITY_PAGES_PROFILE.map((page) => (
          <AuthWrapper key={page.path}>
            <Flex>
              <ModalLink
                to={page.path}
                data-cy={`menu-${page.title}`}
                className={({ isActive }) => (isActive ? 'current' : '')}
              >
                {page.title}
              </ModalLink>
            </Flex>
          </AuthWrapper>
        ))}
        <Flex>
          <LogoutButton onClick={() => logout()} data-cy="menu-Logout">
            Log out
          </LogoutButton>
        </Flex>
      </ModalContainerInner>
    </ModalContainer>
  )
})
