import { Avatar, Box, Flex } from 'theme-ui'

import defaultProfileImage from '../../assets/images/default_member.svg'
import { MemberBadge } from '../MemberBadge/MemberBadge'
import { ProfileTagsList } from '../ProfileTagsList/ProfileTagsList'
import { Username } from '../Username/Username'

import type { IProfileCreator } from 'oa-shared'

interface IProps {
  creator: IProfileCreator
  isLink: boolean
}

export const CardDetailsMemberProfile = ({ creator, isLink }: IProps) => {
  const { _id, badges, countryCode, profileType, tags, userImage } = creator

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
            src={userImage || defaultProfileImage}
            sx={{ width: '60px', height: '60px', objectFit: 'cover' }}
            loading="lazy"
          />
          <MemberBadge
            profileType={profileType}
            size={22}
            sx={{ transform: 'translateY(-22px)' }}
          />
        </Flex>
      </Box>

      <Flex sx={{ flexDirection: 'column', gap: 1, flex: 1 }}>
        <Username
          user={{
            userName: _id,
            countryCode,
            isSupporter: badges?.supporter || false,
            isVerified: badges?.verified || false,
          }}
          sx={{ alignSelf: 'flex-start' }}
          isLink={isLink}
          target="_blank"
        />
        {tags && <ProfileTagsList tags={tags} isSpace={false}/>}
      </Flex>
    </Flex>
  )
}
