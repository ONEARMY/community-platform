import { Avatar, Box, Flex } from 'theme-ui'

import defaultProfileImage from '../../assets/images/default_member.svg'
import { MemberBadge } from '../MemberBadge/MemberBadge'
import { ProfileTagsList } from '../ProfileTagsList/ProfileTagsList'
import { Username } from '../Username/Username'

import type { MapPin } from 'oa-shared'

interface IProps {
  profile: MapPin['profile']
  isLink: boolean
}

export const CardDetailsMemberProfile = ({ profile, isLink }: IProps) => {
  return (
    <Flex
      sx={{
        gap: 2,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
        alignContent: 'stretch',
      }}
    >
      <Box sx={{ aspectRatio: 1, width: '60px', height: '60px' }}>
        <Flex
          sx={{
            alignContent: 'flex-start',
            justifyContent: 'flex-end',
            flexWrap: 'wrap',
          }}
        >
          <Avatar
            src={profile.photo?.publicUrl || defaultProfileImage}
            sx={{ width: '60px', height: '60px', objectFit: 'cover' }}
            loading="lazy"
          />
          <MemberBadge
            profileType={profile.type}
            size={22}
            sx={{ transform: 'translateY(-22px)' }}
          />
        </Flex>
      </Box>

      <Flex sx={{ flexDirection: 'column', gap: 1, flex: 1 }}>
        <Username
          user={{
            userName: profile.username,
            countryCode: profile.country,
            isSupporter: profile.isSupporter || false,
            isVerified: profile.isVerified || false,
          }}
          sx={{ alignSelf: 'flex-start' }}
          isLink={isLink}
          target="_blank"
        />
        {profile.tags && profile.tags.length > 0 && (
          <ProfileTagsList tags={profile.tags} isSpace={false} />
        )}
      </Flex>
    </Flex>
  )
}
