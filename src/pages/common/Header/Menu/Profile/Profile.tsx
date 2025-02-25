import { useState } from 'react'
import Foco from 'react-foco'
import { observer } from 'mobx-react'
import { MemberBadge } from 'oa-components'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import MenuMobileLink from 'src/pages/common/Header/Menu/MenuMobile/MenuMobileLink'
import { ProfileModal } from 'src/pages/common/Header/Menu/ProfileModal/ProfileModal'
import { COMMUNITY_PAGES_PROFILE } from 'src/pages/PageList'
import { cdnImageUrl } from 'src/utils/cdnImageUrl'
import { Avatar, Box, Flex } from 'theme-ui'

import ProfileButtons from './ProfileButtons'

import './profile.css'

interface IState {
  showProfileModal: boolean
}

interface IProps {
  isMobile: boolean
}

const Profile = observer((props: IProps) => {
  const { userStore } = useCommonStores().stores
  const user = userStore.user

  const [state, setState] = useState<IState>({
    showProfileModal: false,
  })

  const toggleProfileModal = () => {
    setState((state) => ({
      ...state,
      showProfileModal: !state.showProfileModal,
    }))
  }

  if (!user) {
    return <ProfileButtons isMobile={props.isMobile} />
  }

  if (props.isMobile) {
    return (
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
        <MenuMobileLink path="/logout" content="Log out" />
      </Box>
    )
  }

  return (
    <Box
      data-cy="user-menu"
      sx={{
        width: '93px',
      }}
    >
      <Flex onClick={() => toggleProfileModal()} sx={{ ml: 1, height: '100%' }}>
        {user.userImage?.downloadUrl ? (
          <Avatar
            data-cy="header-avatar"
            loading="lazy"
            src={cdnImageUrl(user.userImage?.downloadUrl, { width: 40 })}
            sx={{
              objectFit: 'cover',
              width: '40px',
              height: '40px',
            }}
          />
        ) : (
          <MemberBadge
            profileType={user.profileType}
            sx={{ cursor: 'pointer' }}
          />
        )}
      </Flex>
      <Flex>
        {state.showProfileModal && (
          <Foco onClickOutside={() => toggleProfileModal()}>
            <ProfileModal />
          </Foco>
        )}
      </Flex>
    </Box>
  )
})

export default Profile
