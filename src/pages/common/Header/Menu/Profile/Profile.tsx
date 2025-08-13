import { useState } from 'react'
import Foco from 'react-foco'
import { observer } from 'mobx-react'
import { MemberBadge } from 'oa-components'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { ProfileModal } from 'src/pages/common/Header/Menu/ProfileModal/ProfileModal'
import { cdnImageUrl } from 'src/utils/cdnImageUrl'
import { Avatar, Box, Flex } from 'theme-ui'

import ProfileButtons from './ProfileButtons'

const Profile = observer(() => {
  const { userStore } = useCommonStores().stores
  const user = userStore.user

  const [showProfileModal, setShowProfileModal] = useState<boolean>(false)

  if (!user) {
    return <ProfileButtons />
  }

  return (
    <Box data-cy="user-menu" sx={{ zIndex: 5005 }}>
      <Flex sx={{ height: '100%' }} onClick={() => setShowProfileModal(true)}>
        {user.userImage?.downloadUrl ? (
          <Avatar
            data-cy="header-avatar"
            loading="lazy"
            src={cdnImageUrl(user.userImage?.downloadUrl, { width: 40 })}
            sx={{
              cursor: 'pointer',
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
        {showProfileModal && (
          <Foco onClickOutside={() => setShowProfileModal(false)}>
            <ProfileModal onClose={() => setShowProfileModal(false)} />
          </Foco>
        )}
      </Flex>
    </Box>
  )
})

export default Profile
