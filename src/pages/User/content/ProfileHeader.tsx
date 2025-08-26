import { MemberBadge, Username } from 'oa-components'
import DefaultMemberImage from 'src/assets/images/default_member.svg'
import { Avatar, Box, Flex, Heading } from 'theme-ui'

import type { Profile } from 'oa-shared'

interface IProps {
  user: Profile
}

export const ProfileHeader = ({ user }: IProps) => {
  const profileImageSrc = user.photo?.publicUrl ?? DefaultMemberImage

  return (
    <Box sx={{ position: 'relative' }}>
      {user.type?.isSpace && (
        <Box
          sx={{
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 0,
            transform: 'translateY(-50%)',
          }}
        >
          <Box sx={{ display: ['none', 'none', 'block'] }}>
            <MemberBadge size={150} profileType={user.type} />
          </Box>
          <Box sx={{ display: ['none', 'block', 'none'] }}>
            <MemberBadge size={100} profileType={user.type} />
          </Box>
          <Box sx={{ display: ['block', 'none', 'none'] }}>
            <MemberBadge size={75} profileType={user.type} />
          </Box>
        </Box>
      )}
      <Flex sx={{ gap: 2, alignItems: 'center', paddingBottom: [2, 4] }}>
        {profileImageSrc && user.type?.isSpace && (
          <Avatar
            data-cy="userImage"
            src={profileImageSrc}
            sx={{
              objectFit: 'cover',
              width: '50px',
              height: '50px',
            }}
          />
        )}

        {!user.type?.isSpace && (
          <Avatar
            data-cy="profile-avatar"
            loading="lazy"
            src={profileImageSrc}
            sx={{
              objectFit: 'cover',
              width: '120px',
              height: '120px',
            }}
          />
        )}
        <Flex sx={{ flexDirection: 'column' }}>
          <Username user={user} sx={{ alignSelf: 'flex-start' }} />
          <Heading
            as="h1"
            color={'black'}
            style={{ wordBreak: 'break-word' }}
            data-cy="userDisplayName"
          >
            {user.displayName}
          </Heading>
        </Flex>
      </Flex>
    </Box>
  )
}
