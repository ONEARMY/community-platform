import React, { useState } from 'react'
import Foco from 'react-foco'
import { useNavigate } from '@remix-run/react'
import { observer } from 'mobx-react'
import { MemberBadge } from 'oa-components'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import MenuMobileLink from 'src/pages/common/Header/Menu/MenuMobile/MenuMobileLink'
import { ProfileModal } from 'src/pages/common/Header/Menu/ProfileModal/ProfileModal'
import { COMMUNITY_PAGES_PROFILE } from 'src/pages/PageList'
import { Box, Flex } from 'theme-ui'

import ProfileButtons from './ProfileButtons'

import './profile.css'

interface IState {
  showProfileModal: boolean
  isLoading: boolean
}

interface IProps {
  isMobile: boolean
}

const Profile = observer((props: IProps) => {
  const { userStore } = useCommonStores().stores
  const navigate = useNavigate()
  const [state, setState] = useState<IState>({
    showProfileModal: false,
    isLoading: true,
  })

  const toggleProfileModal = () => {
    setState((state) => ({
      ...state,
      showProfileModal: !state.showProfileModal,
    }))
  }

  const user = userStore.user

  if (typeof user === 'undefined' && state.isLoading) {
    return (
      <Box
        sx={{
          width: '143px',
        }}
      />
    )
  }

  return (
    <>
      {user ? (
        props.isMobile ? (
          <Box
            sx={{
              borderBottom: 'none',
              borderColor: 'lightgrey',
              borderTop: '1px solid',
              mt: 1,
            }}
          >
            <MenuMobileLink path={'/u/' + user.userName} content="Profile" />
            {COMMUNITY_PAGES_PROFILE.map((page) => (
              <MenuMobileLink
                path={page.path}
                key={page.path}
                content={page.title}
              />
            ))}
            <MenuMobileLink
              path={window.location.pathname}
              content={'Log out'}
              onClick={async () => {
                await userStore.logout()
                navigate('/')
              }}
            />
          </Box>
        ) : (
          <div
            data-cy="user-menu"
            style={{
              width: '93px',
            }}
          >
            <Flex
              onClick={() => toggleProfileModal()}
              ml={1}
              sx={{ height: '100%' }}
            >
              <MemberBadge profileType={user.profileType} />
            </Flex>
            <Flex>
              {state.showProfileModal && (
                <Foco onClickOutside={() => toggleProfileModal()}>
                  <ProfileModal username={user.userName} />
                </Foco>
              )}
            </Flex>
          </div>
        )
      ) : (
        <ProfileButtons isMobile={props.isMobile} />
      )}
    </>
  )
})

export default Profile
