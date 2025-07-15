import { useState } from 'react'
import Foco from 'react-foco'
import { MemberBadge } from 'oa-components'
import MenuMobileLink from 'src/pages/common/Header/Menu/MenuMobile/MenuMobileLink'
import { ProfileModal } from 'src/pages/common/Header/Menu/ProfileModal/ProfileModal'
import { COMMUNITY_PAGES_PROFILE } from 'src/pages/PageList'
import { useProfileStore } from 'src/stores/Profile/profile.store'
import { Avatar, Box, Flex } from 'theme-ui'

import ProfileButtons from './ProfileButtons'

import './profile.css'

interface IProps {
  isMobile: boolean
}

const Profile = (props: IProps) => {
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false)
  const { profile: profile } = useProfileStore()

  if (!profile) {
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
        <MenuMobileLink path={'/u/' + profile.username} content="Profile" />
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
      <Flex
        onClick={() => setShowProfileModal((x) => !x)}
        sx={{ ml: 1, height: '100%' }}
      >
        {profile.photo ? (
          <Avatar
            data-cy="header-avatar"
            loading="lazy"
            src={profile.photo.publicUrl}
            sx={{
              objectFit: 'cover',
              width: '40px',
              height: '40px',
            }}
          />
        ) : (
          <MemberBadge
            profileType={'space'} // TODO
            sx={{ cursor: 'pointer' }}
          />
        )}
      </Flex>
      <Flex>
        {showProfileModal && (
          <Foco onClickOutside={() => setShowProfileModal(false)}>
            <ProfileModal />
          </Foco>
        )}
      </Flex>
    </Box>
  )
}

export default Profile
