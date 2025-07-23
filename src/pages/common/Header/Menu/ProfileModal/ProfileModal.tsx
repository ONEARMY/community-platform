import { useContext } from 'react'
import styled from '@emotion/styled'
import { NavLink } from '@remix-run/react'
import { observer } from 'mobx-react'
import { ReturnPathLink } from 'oa-components'
import { preciousPlasticTheme } from 'oa-themes'
import { AuthWrapper } from 'src/common/AuthWrapper'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { COMMUNITY_PAGES_PROFILE } from 'src/pages/PageList'
import { Box, Flex } from 'theme-ui'

import { MenusContext } from '../../MenusContext'

// TODO: Remove direct usage of Theme
const theme = preciousPlasticTheme.styles

const ModalContainer = styled(Box)`
  max-width: 100%;
  max-height: 100%;
  position: absolute;
  right: 10px;
  top: 70px;
  z-index: ${theme.zIndex.modalProfile};
  height: 100%;
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

interface IProps {
  onClose: () => void
}

export const ProfileModal = observer(({ onClose }: IProps) => {
  const { userStore } = useCommonStores().stores
  const menusContext = useContext(MenusContext)

  const onClick = () => {
    menusContext.closeAll()
    onClose()
  }

  return (
    <ModalContainer data-cy="user-menu-list">
      <Flex
        sx={{
          zIndex: theme.zIndex.modalProfile,
          position: 'relative',
          background: 'white',
          border: '2px solid black',
          borderRadius: 1,
          overflow: 'hidden',
          flexDirection: 'column',
        }}
      >
        <ModalLink
          onClick={onClick}
          to={'/u/' + userStore.activeUser?.userName}
          data-cy="menu-Profile"
          className={({ isActive }) => (isActive ? 'current' : '')}
        >
          Profile
        </ModalLink>
        {COMMUNITY_PAGES_PROFILE.map((page) => (
          <AuthWrapper key={page.path}>
            <ModalLink
              onClick={onClick}
              to={page.path}
              data-cy={`menu-${page.title}`}
              className={({ isActive }) => (isActive ? 'current' : '')}
            >
              {page.title}
            </ModalLink>
          </AuthWrapper>
        ))}
        <Box
          sx={{
            padding: '10px 30px 10px 30px',
            '&:hover': { background: 'background' },
          }}
        >
          <ReturnPathLink
            onClick={onClick}
            data-cy="menu-Logout"
            to="/logout"
            style={{ color: 'black' }}
          >
            Log out
          </ReturnPathLink>
        </Box>
      </Flex>
    </ModalContainer>
  )
})
